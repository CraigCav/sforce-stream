function createStream(request) {
  return Object.create({
    getReader: function() {
      return createReader(request);
    }
  });
}

function createReader(request) {
  var done = false;
  return Object.create({
    read: function() {
      return fetch(request).then(function(response) {
        return response.json().then(function(result) {
          done = !result.nextRecordsUrl;
          // set up the reader for the next request
          if(!done) {
            var url = new URL(result.nextRecordsUrl, request.url);
            var options = {
              headers: request.headers,
              mode: request.mode,
              credentials: request.credentials,
              redirect: request.redirect
            };
            request = new Request(url, options);
          }
          result.headers = response.headers;
          return {
            done: done,
            value: result
          };
        });
      });
    }
  });
}

function toJson(response) {
  return response.json();
}

module.exports = createStream;