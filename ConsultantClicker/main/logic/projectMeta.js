export const setProjectClickPending = (val=true) => {
    const body = $("body")
    var projectMeta = body.data("projectMeta")
    projectMeta.clickPending = val
    body.data("projectMeta", projectMeta)
}
  
export const getProjectClickPending = () => {
    return $("body").data("projectMeta").clickPending
}