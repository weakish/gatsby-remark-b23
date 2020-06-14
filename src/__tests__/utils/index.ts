import remark from 'remark';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import { readFileSync } from 'fs';

export const cache = {
    get: jest.fn(),
    set: jest.fn()
};

const remarkObj = remark()
    .use(parse)
    .use(stringify)
    .freeze();

export const mockCache: (mockkedCache: any) => jest.Mock<any, any> = (
    mockedCache: any
) => cache.get.mockImplementation(urlStr => mockedCache[urlStr]);

const mdPath = `${__dirname}/../__mocks__`;

const readMdFile = (fileName: string) =>
    readFileSync(`${mdPath}/${fileName}.md`, { encoding: 'utf-8' });

export const getMdAST = (fileName: string) =>
    remarkObj.parse(readMdFile(fileName));

export const getMdfromAST = remarkObj.stringify;
