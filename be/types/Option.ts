export class Option {
  text: string;
  isCorrect: boolean;
  image?: string;

  constructor(id: string, text: string, isCorrect: boolean, image?: string) {
    this.text = text;
    this.isCorrect = isCorrect;
    this.image = image;
  }
}
