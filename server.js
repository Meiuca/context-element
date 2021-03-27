const server = require('express')();
const cors = require('cors');

server
  .use(cors())
  .get('/', (_, res) => {
    res.status(200).json({
      'jota-button': {
        fontSize: `${Math.random() * 50}px`,
        primary: { backgroundColor: Math.random() > 0.5 ? '#000' : 'pink' },
        sizes: { small: { fontSize: `${Math.random() * 30}px` } },
      },
    });
  })
  .get('/xmas/button', (_, res) => {
    res.status(200).json({
      fontSize: `${Math.random() * 50}px`,
      primary: { backgroundColor: 'red' },
      sizes: { small: { fontSize: `${Math.random() * 30}px` } },
    });
  })
  .listen(806, () => console.log('server on'));
