export class Option {
  text: string;
  image?: string;

  constructor(id: string, text: string, image?: string) {
    this.text = text;
    this.image = image;
  }
}
