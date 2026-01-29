'use server';

import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { JobAnalysis } from './analyze-job';

const contentSchema = z.object({
  coverLetter: z.string().describe('완성된 자기소개서 본문 (마크다운 포맷)'),
  summary: z.string().describe('지원 동기 및 핵심 강점 3줄 요약'),
});

export async function generateContent(jobAnalysis: JobAnalysis, resumeText: string): Promise<{ success: boolean; data?: z.infer<typeof contentSchema>; error?: string }> {
  try {
    const { object } = await generateObject({
      model: google('gemini-2.0-flash-exp'),
      schema: contentSchema,
      prompt: `
        당신은 전문 커리어 컨설턴트입니다. 
        아래 제공된 [기업 분석 결과]와 [지원자 이력서]를 매칭하여, 
        해당 기업이 뽑고 싶어할 만한 매력적인 자기소개서(Cover Letter)를 작성해 주세요.

        [기업 분석 결과]
        - 주요 업무: ${jobAnalysis.jobDescription.join(', ')}
        - 필수 역량: ${jobAnalysis.requiredSkills.join(', ')}
        - 인재상: ${jobAnalysis.talentType.join(', ')}
        - 핵심 키워드: ${jobAnalysis.keywords.join(', ')}

        [지원자 이력서]
        ${resumeText}

        [작성 가이드]
        1. **두괄식 작성**: 지원하는 직무에 내가 적임자임을 첫 문단에서 강력하게 어필하세요.
        2. **경험 매칭**: 기업의 '필수 역량' 중 지원자가 보유한 경험을 구체적인 성과(수치 포함)와 함께 연결하세요.
        3. **비전 공유**: 기업의 인재상이나 비전이 나의 커리어 목표와 어떻게 일치하는지 언급하세요.
        4. **전문적 톤앤매너**: 자신감 있으면서도 겸손한 비즈니스 문체를 사용하세요 (합니다/하였습니다 체).
        5. 분량은 공백 포함 1000자 내외로 작성하세요.
        6. 결과물은 가독성 좋은 Markdown 형식으로 출력하세요.
        7. 지원자 이력서에 없는 내용을 지어내지 마세요.
      `,
    });

    return { success: true, data: object };
  } catch (error) {
    console.error('Content generation failed:', error);
    return { success: false, error: '콘텐츠 생성 중 오류가 발생했습니다.' };
  }
}
