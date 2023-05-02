// module.exports = (req, res, next) => {
//   class Response {
//     constructor() {
//       this.statusCode = 200;
//       this.body = {};
//     }
//     status(statusCode) {
//       this.statusCode = statusCode;
//       return this;
//     }
//     data(data) {
//       this.body.data = data;
//       return this;
//     }
//     message(message) {
//       this.body.message = message;
//       return this;
//     }
//     send() {
//       res.status(this.statusCode).json(this.body);
//       return this;
//     }
//   }
//   res.response = new Response();
//   // 定義錯誤回應格式
//   res.error = (message, status, data) => {
//     res.status(status || 500).json({
//       status: 'error',
//       message,
//       data,
//     });
//   };
//   res.data = (data) => {
//     res.response.data(data);
//     return res.response;
//   };
//   res.message = (message) => {
//     res.response.message(message);
//     return res.response;
//   };
//   next();
// };

module.exports = (req, res, next) => {
  const createResponse = (
    initialState = { statusCode: 200, body: { status: 'success' } }
  ) => {
    let state = { ...initialState };

    const data = (data) => {
      return createResponse({
        ...state,
        body: {
          ...state.body,
          data,
        },
      });
    };

    const message = (message) => {
      return createResponse({
        ...state,
        body: {
          ...state.body,
          message,
        },
      });
    };
    const add = (title, titleData) => {
      return createResponse({
        ...state,
        body: {
          ...state.body,
          [title]: titleData,
        },
      });
    };

    const send = () => {
      res.set('Connection', 'keep-alive');
      res.set('Cache-Control', 'no-cache, private');
      res.status(state.statusCode).json(state.body);
      return state;
    };

    return { data, message, send, add };
  };

  res.response = createResponse({
    statusCode: 200,
    body: { status: 'success' },
  });

  res.success = (data, message) => {
    return createResponse({
      statusCode: 200,
      body: { status: 'success', data, message },
    }).send();
  };

  res.error = (message, status, data) => {
    return createResponse({
      statusCode: status || 200,
      body: { status: 'error', message, data },
    }).send();
  };

  res.data = (data) => {
    if (typeof data === 'undefined') {
      throw new Error('Data parameter is required');
    }
    return res.response.data(data);
  };

  res.message = (message) => {
    if (typeof message === 'undefined') {
      throw new Error('Message parameter is required');
    }
    return res.response.message(message);
  };

  next();
};
