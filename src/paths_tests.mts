/**
  * Copyright 2023 Adligo Inc / Scott Morgan
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */
import { I_Paths, I_Path } from './i_paths.ts.adligo.org@slink/i_paths.mjs';
import { Paths, Path } from './paths.ts.adligo.org@slink/paths.mjs';
import {TrialSuite, ApiTrial, Test } from './tests4j.ts.adligo.org@slink/tests4j.mjs';

function out(message: string) {
  console.log(message);
}
export function runPathsTests() {
  console.log('starting io tests suite');
  new TrialSuite('paths tests suite', [
    new ApiTrial('PathTrial', [
      new Test('testEquals', (ac) => {
        let pa : Path = new Path(['home','scott'], false, false);
        ac.equals(pa, pa, 'pa and pa are the same;');
        let pb : Path = new Path(['home','john'], false, false);
        ac.equals(pb, pb, 'pb and pb are the same;');
        ac.notEquals(pa, pb, 'The actual has a different directory');

        //these paths get a little nosencial but just testing the equls method
        let pc : Path = new Path(['home','scott'], true, false);
        ac.notEquals(pa, pc, 'The actual has relative = true');

        let pd : Path = new Path(['home','scott'], false, true);
        ac.notEquals(pa, pd, 'The actual has windows = true');

        let pe : Path = new Path(['home'], false, false);
        ac.notEquals(pa, pe, 'The actual has a shorter path');
      })
    ]),
    new ApiTrial('PathsTrial', [
      new Test('testNormalizeUnixHome', (ac) => {
        let paths: Paths = new Paths();

        let p1: I_Path = paths.normalize('/home/scott');
        ac.isFalse(p1.isRelative(),"/home/scott is NOT relative");
        ac.isFalse(p1.isWindows(),"/home/scott is NOT a Windows Path");
        let parts1 = p1.getParts();
        ac.isTrue(2 == parts1.length,"/home/scott should have 2 parts");
        ac.same('home', parts1[0]);
        ac.same('scott',parts1[1]);
        ac.same('/home/scott', p1.toPathString());
        ac.same('Path [parts=home,scott, relative=false, windows=false]', p1.toString());
      }), 
      new Test('testNormalizeWindowsHome', (ac) => {
        let paths: Paths = new Paths();

        let p2s = 'C:\\Users\\scott';
        let p2: I_Path = paths.normalize(p2s);
        ac.isFalse(p2.isRelative(),p2s + " is NOT relative");
        ac.isTrue(p2.isWindows(),p2s + " is NOT a Windows Path");
        let parts2: string [] = p2.getParts();
        ac.isTrue(3 == parts2.length,p2s + " should have 3 parts, but it has " + parts2.length);
        ac.same('C', parts2[0]);
        ac.same('Users',parts2[1]);
        ac.same('scott',parts2[2]);
        ac.same(p2s, p2.toPathString());
        ac.same('Path [parts=C,Users,scott, relative=false, windows=true]', p2.toString());
      }), 
      new Test('testNormalizeGitBasWindowsHome', (ac) => {
        let paths: Paths = new Paths();

        //yes GitBash with node.js give this goofy half and half path C: with unix style slashes
        let p3s = 'C:/Users/scott';
        let p3: I_Path = paths.normalize(p3s);
        ac.isFalse(p3.isRelative(),p3s + " is NOT relative");
        ac.isTrue(p3.isWindows(),p3s + " is NOT a Windows Path");
        let parts3: string [] = p3.getParts();
        ac.isTrue(3 == parts3.length,p3s + " should have 3 parts, but it has " + parts3.length);
        ac.same('C', parts3[0]);
        ac.same('Users',parts3[1]);
        ac.same('scott',parts3[2]);
        ac.same('C:\\Users\\scott', p3.toPathString());
        ac.same('Path [parts=C,Users,scott, relative=false, windows=true]', p3.toString());
      }), 
      new Test('testNormalizeUnixRelativePath', (ac) => {
        let paths: Paths = new Paths();

        //a basic relative path
        let p4s = './src/foo';
        let p4: I_Path = paths.normalize(p4s);
        ac.isTrue(p4.isRelative(),p4s + " is relative");
        ac.isFalse(p4.isWindows(),p4s + " is NOT a Windows Path");
        let parts4: string [] = p4.getParts();
        ac.isTrue(3 == parts4.length,p4s + " should have 3 parts, but it has " + parts4.length);
        ac.same('.', parts4[0]);
        ac.same('src',parts4[1]);
        ac.same('foo',parts4[2]);
        ac.same(p4s, p4.toPathString());
        ac.same('Path [parts=.,src,foo, relative=true, windows=false]', p4.toString());
      }), 
      new Test('testNormalizeUnixRelativeParentPath', (ac) => {
        let paths: Paths = new Paths();
        // a more complex relative path
        let p5s = '../../../src/foo';
        let p5: I_Path = paths.normalize(p5s);
        ac.isTrue(p5.isRelative(),p5s + " is relative");
        ac.isFalse(p5.isWindows(),p5s + " is NOT a Windows Path");
        let parts5: string [] = p5.getParts();
        ac.isTrue(5 == parts5.length,p5s + " should have 5 parts, but it has " + parts5.length);
        ac.same('..', parts5[0]);
        ac.same('..', parts5[1]);
        ac.same('..', parts5[2]);
        ac.same('src',parts5[3]);
        ac.same('foo',parts5[4]);
        ac.same(p5s, p5.toPathString());
        ac.same('Path [parts=..,..,..,src,foo, relative=true, windows=false]', p5.toString());
      }),
      new Test('testNormalizeWindowsRelativePath', (ac) => {
        let paths: Paths = new Paths();

        //a basic relative path
        let p4s = '.\\src\\foo';
        let p4: I_Path = paths.normalize(p4s);
        ac.isTrue(p4.isRelative(),p4s + " is relative");
        ac.isTrue(p4.isWindows(),p4s + " is a Windows Path");
        let parts4: string [] = p4.getParts();
        ac.isTrue(3 == parts4.length,p4s + " should have 3 parts, but it has " + parts4.length);
        ac.same('.', parts4[0]);
        ac.same('src',parts4[1]);
        ac.same('foo',parts4[2]);
        ac.same(p4s, p4.toPathString());
        ac.same('Path [parts=.,src,foo, relative=true, windows=true]', p4.toString());
      }), 
      new Test('testNormalizeWindowsRelativeParentPath', (ac) => {
        let paths: Paths = new Paths();
        // a more complex relative path
        let p5s = '..\\..\\..\\src\\foo';
        let p5: I_Path = paths.normalize(p5s);
        ac.isTrue(p5.isRelative(),p5s + " is relative");
        ac.isTrue(p5.isWindows(),p5s + " is a Windows Path");
        let parts5: string [] = p5.getParts();
        ac.isTrue(5 == parts5.length,p5s + " should have 5 parts, but it has " + parts5.length);
        ac.same('..', parts5[0]);
        ac.same('..', parts5[1]);
        ac.same('..', parts5[2]);
        ac.same('src',parts5[3]);
        ac.same('foo',parts5[4]);
        ac.same(p5s, p5.toPathString());
        ac.same('Path [parts=..,..,..,src,foo, relative=true, windows=true]', p5.toString());
      }),
      new Test('testNormalizeSpaceError', (ac) => {
        let paths: Paths = new Paths();
        // a more complex relative path
        let p5s = 'some dir';
        ac.error(Paths.SPACES_NOT_ALLOWED_ERROR + p5s, () => paths.normalize(p5s));
      })
    ])
  ]).run().printTextReport();
  console.log('paths tests finished');
}

runPathsTests();