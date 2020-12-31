const axios = require("axios")
const ConnectorError = require("../../exceptions/ConnectorError")

class RedmineConnector {
  /**
   * @param {string} url
   * @param {string} apiKey
   */
  constructor(url, apiKey) {
    this.url = url
    this.apiKey = apiKey
    this.headers = {
      "X-Redmine-API-Key": this.apiKey
    }
  }

  /**
   * @param {string} url
   * @param {string} params
   * @returns {Promise<null|any>}
   */
  getRequest = async (url, params = {}) => {
    try {
      const res = await axios.get(url, { headers: this.headers, params })
      return res.status === 200 ? res.data : null
    } catch (error) {
      return null
    }
  }

  /**
   * @param {string} url
   * @returns {Promise<null|any>}
   */
  headRequest = async (url) => {
    try {
      const res = await axios.head(url, { headers: this.headers })
      return res.status === 200 ? res.data : null
    } catch (error) {
      return null
    }
  }

  /**
   * @returns {Promise<boolean>}
   */
  tryAccess = async () => {
    return (await this.headRequest(`${this.url}/projects.json`)) !== null
  }

  /**
   * @param {int} offset
   * @param {int} limit
   * @return {Promise<any>}
   */
  getUsers = async (offset, limit) => {
    const redmineUsersResponse = await this.getRequest(
      `${this.url}/users.json`, { offset, limit }
    )

    if (!redmineUsersResponse) {
      throw new ConnectorError("Credentials have not rights for importing users")
    }

    const users = []
    for (const redmineUser of redmineUsersResponse.users) {
      const email = redmineUser.email || redmineUser.login

      if (!email || !email.contains("@")) {
        // eslint-disable-next-line no-continue
        continue
      }
      users.push({
        email,
        name: `${redmineUser.firstname} ${redmineUser.lastname}`
      })
    }
    return {
      users, count: redmineUsersResponse.count
    }
  }

  /**
   * @param {array<string>} filters
   * @returns {Promise<{data: [], offset, count, limit} | null>}
   * @param {string} search
   */
  getProjects = async (filters = [], search) => {
    const params = {}
    for (const filter of filters) {
      params[filter.name] = filter.value
    }

    if (search) {
      params.name = `~${search}`
    }

    const redmineProjectsResponse = await this.getRequest(
      `${this.url}/projects.json`,
      params
    )
    if (redmineProjectsResponse === null) return null

    const { offset, limit, projects: redmineProjects, total_count: count } = redmineProjectsResponse

    const projects = []
    for (const redmineProject of redmineProjects) {
      projects.push({
        id: redmineProject.id.toString(),
        title: redmineProject.name,
        url: `${this.url}/projects/${redmineProject.id}/issues`,
        description: redmineProject.description,
        created: redmineProject.created_on
      })
    }
    return { data: projects, count, limit, offset }
  }

  /**
   * @param {string} id
   * @returns {Promise<null|*{}>}
   */
  getProjectMembers = async (id) => {
    let members = await this.getRequest(
      `${this.url}/projects/${id}/memberships.json`
    )
    if (members === null) return null

    const { memberships } = members
    members = []

    for (let i = 0; i < memberships.length; i += 1) {
      const membership = memberships[i]

      if (!membership.user) {
        // eslint-disable-next-line no-continue
        continue
      }

      const userId = membership.user.id
      const user = await this.getUser(userId)

      if (!user || !user.login || !user.login.includes("@")) {
        // eslint-disable-next-line no-continue
        continue
      }

      const member = {
        email: user.login,
        name: `${user.firstname} ${user.lastname}`
      }
      members.push(member)
    }
    return members
  }

  /**
   * @param {string} id
   * @returns {Promise<*>}
   */
  getUser = async (id) => {
    const user = await this.getRequest(`${this.url}/users/${id}.json`)
    return user === null ? null : user.user
  }

  /**
   * @param {array<string>} filters
   * @returns {Promise<{offset, limit, count, issues: []} | null>}
   * @param search
   */
  getIssues = async (filters, search) => {
    const url = `${this.url}/issues.json`

    const params = {}
    for (const filter of filters) {
      params[filter.name] = filter.value
    }

    if (search) {
      params.subject = `~${search}`
    }

    const redmineIssuesRes = await this.getRequest(url, params)
    if (redmineIssuesRes === null) {
      return null
    }

    const issues = []
    const { offset, limit, issues: redmineIssues, total_count: count } = redmineIssuesRes
    for (const redmineIssue of redmineIssues) {
      issues.push({
        id: redmineIssue.id.toString(),
        title: redmineIssue.subject,
        url: `${this.url}/issues/${redmineIssue.id}`,
        description: redmineIssue.description,
        created: redmineIssue.created_on,
        author: redmineIssue.author.name,
        assignee: redmineIssue.assigned_to
          ? redmineIssue.assigned_to.name
          : null,
        due_date: redmineIssue.due_date,
        status: redmineIssue.status.name,
        type: redmineIssue.tracker.name,
        project: redmineIssue.project.name
      })
    }
    return { data: issues, offset, limit, count }
  }
}

module.exports = RedmineConnector
