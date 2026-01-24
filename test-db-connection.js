const net = require('net');

const host = 'ep-patient-mode-ahg1gxif-pooler.c-3.us-east-1.aws.neon.tech';
const port = 5432;

console.log(`Connecting to ${host}:${port}...`);

const socket = new net.Socket();

socket.setTimeout(5000); // 5s timeout

socket.on('connect', () => {
    console.log('✅ Connection established!');
    socket.destroy();
});

socket.on('timeout', () => {
    console.log('❌ Connection timed out');
    socket.destroy();
});

socket.on('error', (err) => {
    console.log('❌ Connection error:', err.message);
});

socket.connect(port, host);
