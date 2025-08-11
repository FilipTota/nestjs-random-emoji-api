import { BadRequestException } from '@nestjs/common';
import { EmojiValidationPipe } from './emoji-validation.pipe';

describe('EmojiValidationPipe', () => {
  const emojiPipe = new EmojiValidationPipe();
  it('should be defined', () => {
    expect(emojiPipe).toBeDefined();
  });

  it('should return undefined if no value is passed in', () => {
    const result = emojiPipe.transform(undefined) as number;
    expect(result).toBeUndefined();
  });

  it('should throw a BadRequest if value is not a number', () => {
    const result = () => emojiPipe.transform('not a number') as number;
    expect(result).toThrow(BadRequestException);
  });

  it('should throw a BadRequest if value is less than 0', () => {
    const result = () => emojiPipe.transform(-1) as number;
    expect(result).toThrow(BadRequestException);
  });

  it('should throw a BadRequest if value is greater than 12', () => {
    const result = () => emojiPipe.transform(13) as number;
    expect(result).toThrow(BadRequestException);
  });

  it('should return respective string input as a number', () => {
    const result = emojiPipe.transform('1') as number;
    expect(result).toBe(1);
  });
});
