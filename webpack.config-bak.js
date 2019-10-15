var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var isProduction = function() {
	return process.env.NODE_ENV === 'production';
};


let agmArr = process.argv;
var isBuild = agmArr[agmArr.length - 1] == "--onlyBuild"
var isBuildZhaomi = agmArr[agmArr.length - 1] == "--zhaomi"
var isBuildZhaomiAdmin = agmArr[agmArr.length - 1] == "--zhaomiadmin"
var isBuildCk = agmArr[agmArr.length - 1] == "--ck"
if (isBuildZhaomi) {
	outputDir = 'D:/working/zhaomi/client/Public/newui/dist';
	entryPath = 'D:/working/wkidt-react-ui/testPages';
} else if (isBuildZhaomiAdmin) {
	outputDir = 'D:/working/zhaomi/admin/Public/admin/newui-admin/dist';
	entryPath = 'D:/working/wkidt-react-ui/zmViews';
} else if (isBuildCk) {
	outputDir = 'D:/working/jisuchedai/garage/Public/admin/dist';
	entryPath = 'D:/working/wkidt-react-ui/jsCk/entry';
} else {
	outputDir = 'D:/working/wkidt-react-ui/dist';
	entryPath = 'D:/working/wkidt-react-ui/testPages';
}


var plugins = null;

function setCommons(set) {
	plugins = [
		new webpack.optimize.CommonsChunkPlugin(set)
	];
}

setCommons({
	name: 'commons',
	filename: 'js/commons.js',
})
if (isProduction()) {
	plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			test: /(\.jsx|\.js)$/,
			compress: {
				warnings: false
			},
		})
	);
}


var entris = fs.readdirSync(entryPath).reduce(function(o, filename) {
	if (!/\./.test(filename)) {
		if (isBuild || isBuildZhaomi || isBuildZhaomiAdmin || isBuildCk) {
			o[filename] = path.join(entryPath, filename, filename + ".jsx");
		} else {
			o[filename] = ['webpack/hot/dev-server', path.join(entryPath, filename, filename + ".jsx")];
		}

	}
	return o;
}, {});

module.exports = {
	debug: true,
	devtool: 'source-map',
	entry: entris,
	output: {
		path: outputDir,
		filename: 'js/[name].bundle.js',
		publicPath: isBuildZhaomiAdmin ? '/admin/newui-admin/dist/' : (isBuildCk ? '/admin/dist/' : '/dist/'),
		chunkFilename: isProduction() ? 'js/[name].chunk.js' : 'js/[name].chunk.min.js',
	},
	module: {
		loaders: [{
			test: /(\.jsx|\.js)$/,
			exclude: /node_modules/,
			loaders: ['babel?presets[]=react&presets[]=es2015&presets[]=stage-0']
		}, ],
		postLoaders: [{
			test: /(\.jsx|\.js)$/,
			loaders: ['es3ify-loader'],
		}, ],
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
	},
	devServer: {
		contentBase: './jsCk',
		port: 9090, //端口你可以自定义
		hot: true,
		inline: true,
		/* proxy: {
		   '/system/bank-area.do': {
		     target: 'http://www.jscdcn.com/system/bank-area.do',
		     host: "www.jscdcn.com",
		     secure: false,
		     changeOrigin: true
		   }
		 }*/
	},

	externals: {
		"jquery": "window.jQuery",
		"easemobim": "window.easemobim",
		'plupload': 'window.plupload',
		'qiniu': 'window.Qiniu',
	},
	plugins: plugins

};