"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import * as cheerio from "cheerio";

const analysisSchema = z.object({
  jobDescription: z.array(z.string()).describe("주요 업무 내용 리스트"),
  requiredSkills: z.array(z.string()).describe("필수 역량 및 자격 요건 리스트"),
  talentType: z
    .array(z.string())
    .describe("기업이 추구하는 인재상 및 핵심 가치"),
  keywords: z.array(z.string()).describe("해당 공고의 핵심 키워드 (5-7개)"),
});

export type JobAnalysis = z.infer<typeof analysisSchema>;

async function fetchUrlContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, and other noise
    $("script, style, iframe, svg, noscript, header, footer").remove();

    // Extract readable text
    const text = $("body").text().replace(/\s+/g, " ").trim();
    return text.slice(0, 10000); // Limit context window usage
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return "";
  }
}

export async function analyzeJobPost(
  jobUrl: string,
  companyUrl: string,
): Promise<{ success: boolean; data?: JobAnalysis; error?: string }> {
  try {
    const [jobText, companyText] = await Promise.all([
      fetchUrlContent(jobUrl),
      companyUrl ? fetchUrlContent(companyUrl) : Promise.resolve(""),
    ]);

    if (!jobText) {
      return {
        success: false,
        error: "채용 공고 내용을 가져올 수 없습니다. URL을 확인해주세요.",
      };
    }

    const { object } = await generateObject({
      model: google("gemini-3-flash-preview"), // Using Flash Lite 2.0 as suggested
      schema: analysisSchema,
      prompt: `
        다음은 채용 공고와 회사 홈페이지에서 추출한 텍스트입니다.
        이 정보를 바탕으로 지원자가 회사의 니즈를 정확히 파악할 수 있도록 4가지 섹션으로 분석해 주세요.
        
        [채용 공고 텍스트]
        ${jobText}

        [회사 홈페이지 텍스트 (참고용)]
        ${companyText}

        분석 가이드:
        1. 한국어로 작성해 주세요.
        2. '주요 업무'는 구체적인 행동 중심으로 요약하세요.
        3. '필수 역량'은 기술 스택과 소프트 스킬을 모두 포함하세요.
        4. '인재상'은 텍스트에 명시되지 않았다면, 공고의 톤앤매너를 통해 유추하세요.
        5. 핵심 키워드는 직무와 관련된 전문 용어 위주로 뽑아주세요.
      `,
    });

    return { success: true, data: object };
  } catch (error) {
    console.error("Analysis failed:", error);
    return {
      success: false,
      error: "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}
