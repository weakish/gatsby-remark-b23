import remark from 'remark';
import { readFileSync } from 'fs';

export const cache = {
    get: jest.fn(),
    set: jest.fn()
};

export const mockCache = mockedCache =>
    cache.get.mockImplementation(urlStr => mockedCache[urlStr]);

const mdPath = `${__dirname}/../__mocks__`;

const readMdFile = fileName =>
    readFileSync(`${mdPath}/${fileName}.md`, { encoding: 'utf-8' });

export const getMdAST = fileName => remark.parse(readMdFile(fileName));

export const getMdfromAST = remark.stringify;
