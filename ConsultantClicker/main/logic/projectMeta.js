export const setProjectClickPending = (val=true) => {
    const body = $("body")
    var projectMeta = body.data("projectMeta")
    projectMeta.clickPending = val
    body.data("projectMeta", projectMeta)
}
  
export const getProjectClickPending = () => {
    return $("body").data("projectMeta").clickPending
}

export const isProjectBufferFull = () => {
    const body = $("body")
    const projectMeta = body.data("projectMeta")
    const projects = body.data("projects")
    return Object.keys(projects).length >= projectMeta.projectBufferSize
}

export const initializeProjectMeta = (projectMeta) => {
  const body = $("body")
  projectMeta.clickPending = false
  body.data("projectMeta", projectMeta)
}

export const getTotalProjectsFinished = () => {
    return $("body").data("projectMeta").totalProjectsFinished
}

export const addFinishedProject = () => {
    var body = $("body")
    var project = body.data("projectMeta")
    project.totalProjectsFinished += 1
    body.data("project", project)
}

export const addToProjectBuffer = () => {
    var body = $("body")
    var project = body.data("projectMeta")
    project.projectBufferSize += 1 
    body.data("projectMeta", project)
}