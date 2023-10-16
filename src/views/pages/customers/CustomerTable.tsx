import { ComponentSearch, ComponentTablePagination } from "@/components";
import { useCustomerStore } from "@/hooks";
import { CustomerModel } from "@/models";
import { Checkbox, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DeleteOutline, EditOutlined, KeyboardArrowDownOutlined, KeyboardArrowUpOutlined } from "@mui/icons-material";
import { ContactTable } from "./contact";

interface tableProps {
  limitInit?: number;
  stateSelect?: boolean;
  stateMultiple?: boolean
  itemSelect?: (customer: CustomerModel) => void;
  items?: any[];
  itemEdit?: (customer: CustomerModel) => void;
}

export const CustomerTable = (props: tableProps) => {
  const {
    stateSelect = false,
    limitInit = 10,
    itemSelect,
    items,
    itemEdit,
  } = props;

  const { customers, flag, getCustomers, deleteRemoveCustomer } = useCustomerStore();

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(limitInit)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {//escucha si "page", "limit" o "flag" se modifico
    getCustomers({ page, limit }).then((total) => setTotal(total))
  }, [page, limit, flag]);


  return (
    <Stack sx={{ paddingRight: '10px' }}>
      <ComponentSearch
        title="Buscar Cliente"
      />
      <TableContainer>
        <Table sx={{ minWidth: 350 }} size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#E2F6F0' }}>
              {stateSelect && <TableCell />}
              <TableCell sx={{ fontWeight: 'bold' }} >Nit</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} >Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} >Tipo de Cliente</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} >Contactos</TableCell>
              {stateSelect && <TableCell sx={{ fontWeight: 'bold' }} >Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              customers.map((customer: CustomerModel) => {
                const isSelected = items?.includes(customer.id);
                return (
                  <React.Fragment key={customer.id} >
                    <TableRow>
                      {
                        stateSelect && <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => itemSelect!(customer)}
                          />
                        </TableCell>
                      }
                      <TableCell>{customer.nit ?? customer.contacts.length > 0 ? customer.contacts[0].ci_nit : ''} </TableCell>
                      <TableCell>{customer.institution_name ?? customer.contacts.length > 0 ? customer.contacts[0].name : ''}</TableCell>
                      <TableCell>{customer.customer_type.name}</TableCell>
                      {
                        customer.customer_type.is_institution ?
                          <TableCell>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => {
                                if (openIndex == customer.id) {
                                  setOpenIndex(null)
                                } else {

                                  setOpenIndex(customer.id);
                                }
                              }}
                            >
                              {openIndex == customer.id ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
                            </IconButton>
                          </TableCell> :
                          <TableCell />
                      }
                      <TableCell>
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                        >
                          <IconButton onClick={() => itemEdit!(customer)} >
                            <EditOutlined color="info" />
                          </IconButton>
                          <IconButton onClick={() => deleteRemoveCustomer(customer)} >
                            <DeleteOutline color="error" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <ContactTable
                      open={openIndex == customer.id}
                      contacts={customer.contacts}
                      customerId={customer.id}
                    />
                  </React.Fragment>
                )
              }
              )}
          </TableBody>
        </Table>
      </TableContainer>
      <ComponentTablePagination
        total={total}
        onPageChange={(value) => setPage(value)}
        onRowsPerPageChange={(value) => setLimit(value)}
        page={page}
        limit={limit}
      />
    </Stack>
  );
}
