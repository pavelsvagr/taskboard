import React, { useState } from "react"

import { Button, Col, Input, Row, Spin } from "antd"
import { SyncOutlined } from "@ant-design/icons"

import Role from "@shared/security/roles"
import ActionButtons from "components/comon/buttons/ActionButtons"
import AddButton from "components/comon/buttons/AddButton"
import UnlockAccess from "components/comon/security/UnlockAccess"
import EmptyData from "components/comon/data/EmptyData"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import debounce from "lodash.debounce"
import CredentialCard from "./CredentialCard"
import shapes from "../../types"
import { fetchCredentials, SUBJECT_CREDENTIALS } from "../../actions"
import DataPagination from "../board/forms/DataPagination"

const CredentialsBox = ({
  onCardClick,
  onNew,
  gutter,
  sizing,
  data,
  actions,
  loading,
  fetchCredentials: fetch,
}) => {
  const { data: credentials = [], offset = 0, limit = 0, count = 0 } = data
  const [search, handleSetSearch] = useState("")

  const handleFetch = debounce(fetch, 300)

  const handleSearch = (newSearch) => {
    handleSetSearch(newSearch)
    handleFetch(newSearch, offset, limit)
  }

  const handleReload = () => {
    fetch(search, offset, limit)
  }

  const spinning = !!loading?.states[SUBJECT_CREDENTIALS]

  return (
    <Spin spinning={spinning}>
      <div className="box-container">
        <div className="box-container__toolbox">
          <Input.Search
            placeholder="Search..."
            onSearch={handleSearch}
            style={{ width: 250 }}
          />
          <Button onClick={handleReload} icon={<SyncOutlined />}>
            Refresh
          </Button>
        </div>
        <div>
          <Row gutter={gutter} className="box-container__row">
            {credentials?.length ? (
              credentials.map((credential) => (
                <Col key={credential._id} {...sizing}>
                  <UnlockAccess
                    globalRoles={[Role.Admin]}
                    lock={(
                      <CredentialCard
                        onClick={onCardClick}
                        actions={[]}
                        credentials={credential}
                        search={search}
                      />
                  )}
                  >
                    <CredentialCard
                      onClick={onCardClick}
                      actions={actions}
                      credentials={credential}
                      search={search}
                    />
                  </UnlockAccess>
                </Col>
              ))
            ) : (
              <Col span={24} style={{ textAlign: "center" }}>
                <UnlockAccess
                  globalRoles={[Role.Admin]}
                  lock={<EmptyData description="No credentials found." />}
                >
                  <EmptyData
                    description="No credentials found."
                    onClick={onNew || null}
                  />
                </UnlockAccess>
              </Col>
            )}
          </Row>
          <div className="text-center">
            <DataPagination
              offset={offset}
              limit={limit}
              count={count}
              search={search}
              onFetch={fetch}
              size="medium"
              showSizeChanger
            />
          </div>
        </div>
        {!!credentials?.length && onNew && (
          <UnlockAccess globalRoles={[Role.Admin]}>
            <ActionButtons>
              <AddButton onClick={onNew} shape="circle" />
            </ActionButtons>
          </UnlockAccess>
        )}
      </div>
    </Spin>
  )
}

CredentialsBox.propTypes = {
  onCardClick: PropTypes.func,
  fetchCredentials: PropTypes.func.isRequired,
  onNew: PropTypes.func,
  loading: shapes.loading,
  actions: PropTypes.arrayOf(PropTypes.object),
  gutter: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
  sizing: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
  data: shapes.paginate(shapes.credentials),
}

CredentialsBox.defaultProps = {
  onCardClick: null,
  onNew: null,
  actions: [],
  data: {},
  gutter: null,
  sizing: null,
  loading: null,
}

function mapStateToProps({ credentials, loading }) {
  return { data: credentials?.all, loading }
}

export default connect(mapStateToProps, { fetchCredentials })(CredentialsBox)
