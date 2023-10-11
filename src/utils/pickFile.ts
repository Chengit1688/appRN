import DocumentPicker from 'react-native-document-picker';

const FileTypes = {
  All: DocumentPicker.types.allFiles,
  Text: DocumentPicker.types.plainText,
  Audio: DocumentPicker.types.audio,
  PDF: DocumentPicker.types.pdf,
  Zip: DocumentPicker.types.zip,
  Csv: DocumentPicker.types.csv,
};

//单选文件
export const pickSingFile = async (fileType?: any) => {
  try {
    const res = await DocumentPicker.pick({
      type: DocumentPicker.types.allFiles,
    });
    console.log('pickSingFile', res);
    return res;
  } catch (err) {}
};
