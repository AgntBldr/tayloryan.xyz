module.exports = {
  content: [
    "./*.html",
    "./portfolio/**/*.html",
    "./assets/js/**/*.js",
    "./DEPLOY_PUBLIC/**/*.html",
    "./DEPLOY_PUBLIC/assets/js/**/*.js"
  ],
  safelist: [
    "hover:text-green-400",
    "hover:text-purple-400",
    "hover:text-blue-400",
    "hover:text-cyan-400",
    "hover:text-orange-400",
    "hover:text-yellow-400",
    "hover:text-pink-400",
    "group-hover:text-green-400",
    "group-hover:text-purple-400",
    "group-hover:text-blue-400",
    "group-hover:text-cyan-400",
    "group-hover:text-orange-400",
    "group-hover:text-yellow-400",
    "group-hover:text-pink-400",
    "hover:border-green-500",
    "hover:border-purple-500",
    "hover:border-blue-500",
    "hover:border-cyan-500",
    "hover:border-orange-500",
    "hover:border-yellow-500",
    "hover:border-pink-500"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
