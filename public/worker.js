// This is the code that will run inside the worker thread
onmessage = function (e) {
            // Perform some time-consuming task here
            const result = e.data * 2;
          
            // Send the result back to the main thread
            postMessage(result);
          };
          