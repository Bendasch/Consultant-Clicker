export function setProgressBar(progress, effort) {
    var percentage = (progress / effort) * 100;
    $("#progressBar").width(percentage + "%");
}