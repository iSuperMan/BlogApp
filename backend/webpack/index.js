import webpack from 'webpack'
import webpackConfig from './common.config'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

export default app => {

    if(process.env.NODE_ENV !== 'test') {
        const compiler = webpack(webpackConfig);
       
        if (process.env.NODE_ENV !== 'production') {
            app.use(webpackDevMiddleware(compiler, {
                noInfo: true, publicPath: webpackConfig.output.publicPath,
            }));

            app.use(webpackHotMiddleware(compiler, {
                log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
            }));
        }
    }    
}