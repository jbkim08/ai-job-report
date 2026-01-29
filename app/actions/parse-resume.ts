'use server';

export async function parseResume(formData: FormData): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: '파일이 제공되지 않았습니다.' };
    }

    // 파일 내용을 텍스트로 읽기
    const text = await file.text();
    
    if (!text || text.trim().length === 0) {
      return { success: false, error: '파일 내용이 비어있습니다.' };
    }

    return { success: true, text };
  } catch (error) {
    console.error('Resume parsing error:', error);
    return { success: false, error: '이력서 파일 읽기에 실패했습니다. 올바른 텍스트 파일(.txt)인지 확인해 주세요.' };
  }
}
