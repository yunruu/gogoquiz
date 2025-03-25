import { Option } from '../types';

export class Question {
  id: string;
  title: string;
  options: Option[];
  correctOption: number;

  constructor(id: string, title: string, options: Option[], correctOption: number) {
    this.id = id;
    this.title = title;
    this.options = options;
    this.correctOption = correctOption;
  }
}
