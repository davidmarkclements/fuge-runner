/*
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

var fs = require('fs');
var request = require('request');
var test = require('tape');
var main = require('../runner.js')();
var sys = require('./fixture/system/systemDefinition.js');


test('runner test', function(t) {
  t.plan(4);

  fs.writeFileSync(__dirname + '/fixture/system/response.json', '{ "resp": "Hello World!\\n" }', 'utf8');
  main.start(sys, function(err) {
    t.equal(err, undefined);

    setTimeout(function() {
      request('http://localhost:8000', function (error, response, body) {
        t.equal(body, 'Hello World!\n');

        fs.writeFileSync(__dirname + '/fixture/system/response.json', '{ "resp": "Hello Fish!\\n" }', 'utf8');
        setTimeout(function() {
          request('http://localhost:8000', function (error, response, body) {
            t.equal(body, 'Hello Fish!\n');
            main.stop(function(err) {
              t.equal(err, undefined);
            });
          });
        }, 1000);
      });
    }, 1000);
  });
});

