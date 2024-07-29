import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { promisify } from 'util';

@Injectable()
export class FsProxy {
  public fs = fs;

  public existsAsync!: (path: string) => Promise<boolean>;
  public readdirAsync!: (path: string) => Promise<string[]>;
  public unlinkAsync!: (path: string) => Promise<void>;

  constructor() {
    this.enableAsync();
  }

  enableAsync() {
    this.existsAsync = promisify(this.fs.exists).bind(this.fs);
    this.readdirAsync = promisify(this.fs.readdir).bind(this.fs);
    this.unlinkAsync = promisify(this.fs.unlink).bind(this.fs);
  }
}
