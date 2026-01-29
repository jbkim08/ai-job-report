'use server';

import { PDFParse } from 'pdf-parse';

export async function parseResume(formData: FormData): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: '파일이 제공되지 않았습니다.' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // pdf-parse v2.4.5+ (ESM) 클래스 방식 사용
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    
    return { success: true, text: data.text };
  } catch (error) {
    console.error('PDF parsing error:', error);
    return { success: false, error: '이력서 파일 읽기에 실패했습니다. 올바른 PDF 파일인지 확인해 주세요.' };
  }
}
