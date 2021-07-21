import { Formatter, FormatterDec } from '../utils/utils.js'
import { projectClick } from '../logic/project.js'

export const renderProjects = () => {
    
    const body = $("body");
    const projectMeta = body.data("projectMeta");
    var projects = body.data("projects");

    var width = ($("#projectBar").width() / Object.keys(projects).length) - 4;

    var projectBuffer = $("#projectBuffer");
    projectBuffer.text(Object.keys(projects).length + " / " + projectMeta.projectBufferSize);
    (projectMeta.projectBufferSize > Object.keys(projects).length) ? setNotFull(projectBuffer) : setFull(projectBuffer);

    Object.keys(projects).forEach( (projectId) => {
        renderProject(projects[projectId], width);
    });
}

const renderProject = (oProject, width) => {

    const projectBar = $("#projectBar");
    const projectId = oProject.id;
    var projectDiv; 

    // creat the div if it does not exist
    if ($("#" + projectId).length == 0) {

        // project itself
        projectBar.append("<div id='" + projectId + "' class='project'></div>");
        projectDiv = $("#"+projectId);

        // the details
        projectDiv.append('<p>' + oProject.name + '</p>');
        projectDiv.append('<p>' + Formatter.format(oProject.value) + '</p>');

        // the progress bar and prog + effort numbers
        var progressWrapper = $("<div id='" + projectId + "-progressWrapper' class='progressWrapper'></div>")
        projectDiv.append(progressWrapper);
        progressWrapper.append("<div id='" + projectId + "-progressBar' class='progressBar'></div>");
        progressWrapper.append("<p id='" + projectId + "-projectProgress'></p>");

        // click event
        projectDiv.unbind().click(() => projectClick(projectId));

    } else {        

        projectDiv = $("#"+projectId);
    }

    oProject.active ? setActive(projectDiv) : setInactive(projectDiv);
    projectDiv.css("width", width);

    setProjectProgress(projectId, oProject.progress, oProject.effort)
    setProgressBar(projectId, oProject.progress, oProject.effort);
}

const setProjectProgress = (projectId, progress, effort) => {
    $("#" + projectId + "-projectProgress").text(FormatterDec.format(progress.toFixed(0)) + " / " + FormatterDec.format(effort));
}

export const destroyProjectDOM = (projectId) => {
    $("#" + projectId).empty();
    document.getElementById(projectId).remove();
}

export const destroyAllProjects = () => {
    var projects = $("#projectBar").children(".project")
    projects.remove()
}

const setProgressBar = (projectId, progress, effort) => {
    var percentage = (progress / effort) * 100;
    $("#" + projectId + "-progressBar").width(percentage + "%");
    $("#" + projectId + "projectProgress").text(progress.toFixed(2) + " / " + effort.toFixed(2));
}

const setActive = (div) => {
    div.removeClass("inactive");
    div.addClass("active");
}

const setInactive = (div) => {
    div.removeClass("active");
    div.addClass("inactive");
}

const setFull = (div) => {
    div.removeClass("not-full");
    div.addClass("full");
}

const setNotFull = (div) => {
    div.removeClass("full");
    div.addClass("not-full");
}