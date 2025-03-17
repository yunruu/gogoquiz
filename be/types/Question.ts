import { Option } from '../types';

export class Question {
  id: string;
  text: string;
  options: Option[];
  correctOption: number;

  constructor(id: string, text: string, options: Option[], correctOption: number) {
    this.id = id;
    this.text = text;
    this.options = options;
    this.correctOption = correctOption;
  }
}
