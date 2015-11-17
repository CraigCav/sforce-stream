## sforce-stream

The Salesforce query call in the REST API returns a 2000 record chunk at one time. The example below shows a typical REST API call returning 2000 records only.

Example usage for executing a Salesforce REST API query

```term
# dataset of 50k records, but the API call will return only 2000 records
curl https://na1.salesforce.com/services/data/v20.0/query/?q=SELECT+name+from+Account -H "Authorization: Bearer token"
```

Example Response
```json
{
  "done" : true,
  "totalSize" : 50000,
  "nextRecordsUrl": "/services/data/v20.0/query/01gD0000002HU6KIAW-2000",
  "records": [
    {
      "attributes" :
      {
        "type" : "Account",
        "url" : "/services/data/v20.0/sobjects/Account/001D000000IRFmaIAH"
      },
      "Name" : "Test 1"
    },
    {
      "attributes" :
      {
        "type" : "Account",
        "url" : "/services/data/v20.0/sobjects/Account/001D000000IomazIAB"
      },
      "Name" : "Test 2"
    }
  ]
}

```

The **sforce-stream** function implements a [Readable Stream](https://streams.spec.whatwg.org/#rs-intro). By calling the `read` method on this stream object, your query call will automatically start streaming the records from your query in 2000 record batches.

You can read the stream directly by acquiring a reader and using its read() method to get successive chunks:

```js
const sforceStream = require('sforce-stream');

function consume(reader, total) {
  total = total || 0;
  return reader.read().then((res) => {
    const done = res.done, value = res.value;
    if (done) return;
    total += value.records.length;
    console.log("received " + value.records.length + " rows (" + total + " in total).");
    return consume(reader, total);
  })
}

const url = "/services/data/v20.0/query/?q=SELECT+name+from+Account";

// set up auth header from seesion ID
// example based on usage from a visual force page
var headers = new Headers();
headers.append('Authorization', 'Bearer {!$Api.Session_ID}');

const request = new Request(url, { headers: headers });
const stream = sforceStream(request);
const reader = stream.getReader();

consume(reader)
  .then(() => console.log("consumed the entire body without keeping the whole thing in memory!"))
  .catch((e) => console.error("something went wrong", e))
```

