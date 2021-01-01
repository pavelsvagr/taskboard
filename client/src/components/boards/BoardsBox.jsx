import React, { useState } from "react"

import "styles/cards.sass"
import { Button, Col, Input, Row } from "antd"
import { SyncOutlined } from "@ant-design/icons"

import Role from "@shared/security/roles"

import ActionButtons from "components/comon/buttons/ActionButtons"
import AddButton from "components/comon/buttons/AddButton"
import UnlockAccess from "components/comon/security/UnlockAccess"
import EmptyData from "components/comon/data/EmptyData"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import debounce from "lodash.debounce"
import BoardCard from "./BoardCard"
import shapes from "../../types"
import DataPagination from "../board/forms/DataPagination"
import { fetchBoards } from "../../actions"

const BoardsBox = ({
  onCardClick,
  onNew,
  gutter,
  sizing,
  data,
  actions,
  fetchBoards: fetch,
}) => {
  const { data: boards = [], offset = 0, limit = 0, count = 0 } = data
  const [search, handleSetSearch] = useState("")

  const handleFetch = debounce(fetch, 300)

  const handleSearch = (newSearch) => {
    handleSetSearch(newSearch)
    handleFetch(newSearch, offset, limit)
  }

  const handleReload = () => {
    fetch(search, offset, limit)
  }

  return (
    <div className="box-container">
      <div className="box-container__toolbox">
        <Input.Search
          placeholder="Search..."
          onSearch={handleSearch}
          style={{ width: 250 }}
          allowClear
        />
        <Button onClick={handleReload} icon={<SyncOutlined />}>
          Refresh
        </Button>
      </div>
      <Row gutter={gutter} className="box-container__row">
        {boards !== null && boards.length ? (
          boards.map((board) => (
            <Col key={board.identifier} {...sizing}>
              <BoardCard
                onClick={onCardClick}
                actions={actions}
                board={board}
                search={search}
              />
            </Col>
          ))
        ) : (
          <Col span={24} style={{ textAlign: "center" }}>
            <UnlockAccess
              globalRoles={[Role.Admin, Role.Mod]}
              lock={<EmptyData description="You have no active boards" />}
            >
              <EmptyData
                description="No active boards"
                onClick={!boards.length && onNew ? onNew : null}
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
      {!!boards.length && onNew && (
        <UnlockAccess globalRoles={[Role.Admin, Role.Mod]}>
          <ActionButtons>
            <AddButton onClick={onNew} shape="circle" />
          </ActionButtons>
        </UnlockAccess>
      )}
    </div>
  )
}

BoardsBox.propTypes = {
  onCardClick: PropTypes.func.isRequired,
  onNew: PropTypes.func.isRequired,
  fetchBoards: PropTypes.func.isRequired,
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
  data: shapes.paginate(shapes.board),
}

BoardsBox.defaultProps = {
  actions: [],
  data: {},
  gutter: null,
  sizing: null,
}

function mapStateToProps({ boards }) {
  return { data: boards?.all }
}

export default connect(mapStateToProps, { fetchBoards })(BoardsBox)
