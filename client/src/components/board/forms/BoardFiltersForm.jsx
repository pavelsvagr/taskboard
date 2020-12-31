import React, { Component } from "react"
import { connect } from "react-redux"

import { Col, Form, Row, Spin } from "antd"
import { SUBJECT_BOARD } from "actions"
import PropTypes from "prop-types"
import FiltersInput from "./FiltersInput"
import FormSubmit from "../../comon/inputs/FormSubmit"
import FiltersHelp from "../help/FiltersHelp"
import shapes from "../../../types"
import { renderAntItem } from "../../../helpers/forms"
import { updateBoard } from "../../../actions"

class BoardSettingsForm extends Component {
  rules = {
    apiFilters: [
      {
        validator: (rule, value) => {
          if (!value) {
            return Promise.resolve()
          }
          for (let i = 0; i < value.length; i += 1) {
            const filter = value[i]
            if (!filter.name) {
              return Promise.reject(
                new Error(`Filter ${i + 1} needs some name`)
              )
            }
            if (!filter.value) {
              return Promise.reject(
                new Error(`Filter ${i + 1}: ${filter.name} must have some value`)
              )
            }
          }
          return Promise.resolve()
        }
      }
    ]
  }

  // Items for form inputs
  items = {
    apiFilters: {
      name: "apiFilters",
      rules: this.rules.apiFilters,
      validateTrigger: "onSubmit"
    }
  }

  handleSubmit = (values) => {
    const { board, updateBoard: update } = this.props
    const newBoard = { ...board, ...values }
    update(board.identifier, newBoard)
  }

  render() {
    const { board, loading, error } = this.props

    const defaults = { apiFilters: board.apiFilters }
    const spinning =
      loading.active !== 0 && loading.states[SUBJECT_BOARD] !== undefined

    return (
      <Spin spinning={spinning}>
        <Row style={{ marginBottom: 10 }}>
          <Col span={18}>
            <h3>
              {board.credentials.type.toUpperCase()}
              {" "}
              API filters
            </h3>
          </Col>
          <Col span={6}>
            <FiltersHelp />
          </Col>
        </Row>

        <Form
          labelCol={{ span: 8 }}
          requiredMark={false}
          onFinish={this.handleSubmit}
          initialValues={defaults}
        >
          {renderAntItem("apiFilters",this.items.apiFilters, error,
            <FiltersInput />
            )}
          <FormSubmit title='Save' size="large" />
        </Form>
      </Spin>
    )
  }
}

BoardSettingsForm.propTypes = {
  board: shapes.board.isRequired,
  loading: shapes.loading,
  error: shapes.errors,
  updateBoard: PropTypes.func.isRequired
}

BoardSettingsForm.defaultProps = {
  loading: null,
  error: null
}

function mapStateToProps({ loading, errors }) {
  return { loading, error: errors?.error}
}

export default connect(mapStateToProps, { updateBoard })(BoardSettingsForm)
