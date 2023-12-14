import {
  Flex,
  IconButton,
  Pagination,
  Table,
} from "@contentful/f36-components";
import tokens from "@contentful/f36-tokens";
import { useState } from "react";
import { IRedirect } from "../locations/Field";
import { EditIcon, DeleteIcon } from "@contentful/f36-icons";

export default function RedirectsPanel({
  redirects,
}: {
  redirects: Array<IRedirect>;
}) {
  const [page, setPage] = useState(0);

  return (
    <>
      <Flex paddingTop="spacingL">
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>
                <strong>From</strong>
              </Table.Cell>
              <Table.Cell>
                <strong>To</strong>
              </Table.Cell>
              <Table.Cell>
                <strong>Type</strong>
              </Table.Cell>
              <Table.Cell>
                <strong>Actions</strong>
              </Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {redirects.map((redirect: IRedirect) => {
              return (
                <>
                  <Table.Row>
                    <Table.Cell>{redirect.from}</Table.Cell>
                    <Table.Cell>{redirect.to}</Table.Cell>
                    <Table.Cell>{redirect.type}</Table.Cell>
                    <Table.Cell>
                      <IconButton
                        size="small"
                        variant="transparent"
                        aria-label="Edit redirect"
                        icon={<EditIcon size="tiny" />}
                      />
                      <IconButton
                        size="small"
                        variant="transparent"
                        aria-label="Delete redirect"
                        icon={<DeleteIcon size="tiny" />}
                      />
                    </Table.Cell>
                  </Table.Row>
                </>
              );
            })}
          </Table.Body>
        </Table>
      </Flex>
      <Pagination
        style={{ paddingTop: tokens.spacingM, paddingBottom: tokens.spacingM }}
        activePage={page}
        onPageChange={setPage}
        itemsPerPage={10}
        totalItems={redirects.length}
      />
    </>
  );
}
