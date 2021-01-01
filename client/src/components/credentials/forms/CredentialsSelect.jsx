import React, { useState } from "react"

import { Card, Modal, Skeleton } from "antd"

import history from "helpers/history"
import CredentialCard from "components/credentials/CredentialCard"
import CredentialsBox from "components/credentials/CredentialsBox"

const CredentialsSelect = ({ value = {}, onChange, data }) => {
  const [showModal, setShowModal] = useState()

  return (
    <div>
      {showModal && (
        <Modal
          title="Select credentials"
          visible
          closable
          onCancel={() => setShowModal(false)}
          footer={null}
          width={1500}
        >
          <CredentialsBox
            onNew={
              data?.data?.length ? null : () => history.push("/credentials/new")
            }
            onCardClick={(credentials) => {
              setShowModal(false)
              onChange(credentials)
            }}
            search=""
            sizing={{ xs: 24, sm: 24, xl: 6, md: 12 }}
            gutter={[
              { xs: 2, sm: 8, md: 16, lg: 32 },
              { xs: 4, sm: 8, md: 16, lg: 32 },
            ]}
            actions={[]}
          />
        </Modal>
      )}
      {value ? (
        <CredentialCard
          credentials={value}
          onClick={() => setShowModal(true)}
        />
      ) : (
        <Card onClick={() => setShowModal(true)} hoverable>
          <Skeleton avatar paragraph={{ rows: 1 }} />
        </Card>
      )}
    </div>
  )
}

export default CredentialsSelect
