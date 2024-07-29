import { readFileSync } from 'fs';
import { parse } from 'papaparse';

export class FileHelper {
  async csvReader<T>(path): Promise<T> {
    const csvFile = readFileSync(path);
    const csvData = csvFile.toString();

    const csvParsed = await parse(csvData, {
      header: true,
      skipEmptyLines: true,
      // dynamicTyping: true,
      transform: (value) => {
        if (value === 'TRUE') {
          return true;
        }
        if (value === 'FALSE') {
          return false;
        }

        try {
          return JSON.parse(value);
        } catch (err) {
          return value;
        }
      },
      // transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
      complete: (results) => results.data,
    });

    return <T>csvParsed?.data;
  }
}
