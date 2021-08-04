import { FormatterDec, FormatterNoDec} from '../utils/utils.js'
import { projectClick } from '../logic/project.js'

export const renderProjects = () => {
    
    const body = $("body");
    const projectMeta = body.data("projectMeta");
    var projects = body.data("projects");

    var width = ($("#projectBar").width() / Object.keys(projects).length) - 4;

    setProjectBuffer(projects, projectMeta)

    Object.keys(projects).forEach( (projectId) => {
        renderProject(projects[projectId], width);
    });
}

const setProjectBuffer = (projects, projectMeta) => {
    var projectBuffer = $("#projectBuffer")
    projectBuffer.text(Object.keys(projects).length + " / " + projectMeta.projectBufferSize + " project(s)")
    if (projectMeta.projectBufferSize > Object.keys(projects).length) {
        setNotFull(projectBuffer)
    } else {
        setFull(projectBuffer)
    }
}

const renderProject = (project, width) => {

    const projectBar = $("#projectBar");
    const projectId = project.id;
    var projectDiv; 

    // creat the div if it does not exist
    if ($("#" + projectId).length == 0) {

        // project itself
        projectBar.append("<div id='" + projectId + "' class='project'></div>");
        projectDiv = $("#"+projectId);

        // the details
        projectDiv.append('<p>' + project.name + '</p>');
        projectDiv.append('<p>' + FormatterNoDec.format(project.value) + '</p>');
        setProjectFontSize(project.name, projectId)

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

    project.active ? setActive(projectDiv) : setInactive(projectDiv);
    projectDiv.css("width", width);

    setProjectProgress(projectId, project.progress, project.effort)
    setProgressBar(projectId, project.progress, project.effort);
}

const setProjectFontSize = (projectName, projectId) => {

    var fontSize = parseInt($(`#${projectId}`).children('p').css('font-size'))
    if (projectName.length > 25) {
        fontSize *= 0.7
    } else if (projectName.length > 20) {
        fontSize *= 0.75
    } else if (projectName.length > 15) {
        fontSize *= 0.8
    } else if (projectName.length > 10) {
        fontSize *= 0.85           
    }
    $(`#${projectId}`).children('p').css('font-size', `${fontSize}px`)
}

const setProjectProgress = (projectId, progress, effort) => {
    $("#" + projectId + "-projectProgress").text(FormatterDec.format(progress.toFixed(0)) + " / " + FormatterDec.format(effort));
}

export const destroyProjectDOM = (projectId) => {
    $("#" + projectId).empty();
    document.getElementById(projectId).remove();
}

export const emptyProjectBar = () => {
    $("#projectBar").empty()
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