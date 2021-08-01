const path = require('path');
const Koa = require('koa');

const clients = new Set();

const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const { Promise } = require('mongoose');
const { resolve } = require('path');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
    ctx.status = 200;
    ctx.body = await new Promise((resolve, reject), () => {
        clients.add(resolve);
    });
});

router.post('/publish', async (ctx, next) => {
    const message = ctx.request.body.message;
    if (!message) {
        ctx.throw(400, 'Message is empty');
    }

    await new Promise((resolve, reject), (message) => {
        clients.forEach(resolve => resolve(message));
        clients.clear;
    });

    ctx.status = 200;
    ctx.body = 'Published'
});

app.use(router.routes());

module.exports = app;
