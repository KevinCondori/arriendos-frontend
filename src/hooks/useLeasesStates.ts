import { useDispatch, useSelector } from "react-redux"
import { coffeApiKevin } from "@/services";
import { setCurrentRentalState, setRentalInformation, setStates } from '@/store';
import Swal from "sweetalert2";

const api = coffeApiKevin;

export const useLeasesStates = () => {
  const { states, rentalInformation, currentRentalState } = useSelector((state: any) => state.rentals);
  const dispatch = useDispatch()

  const getLeaseState = async () => {
    console.log('OBTENIENDO LA LISTA DE ESTADOS');
    const { data } = await api.get(`/leases/list_state/`)
    console.log(data)
    dispatch(setStates({ states: data }))
  }

  const getRental = async (rentalId: number) => {
    dispatch(setRentalInformation({ rentalInformation: null }))
    console.log("OBTENIENDO LA INFORMACIÓN DEL ALQUILER")
    const { data } = await api.get(`/leases/get_rental_information/`, {
      params: {
        rental: rentalId
      }
    });
    console.log(data)
    dispatch(setRentalInformation({ rentalInformation: data }))
  }

  const getCurrentLeaseState = async (rental: number) => {
    try {
      dispatch(setCurrentRentalState({ currentRentalState: null }));
      console.log('OBTENIENDO EL ESTADO ACTUAL');
      const { data } = await api.get(`/leases/get_state/`, {
        params: {
          rental: rental
        }
      })
      console.log(data)
      dispatch(setCurrentRentalState({ currentRentalState: data }));
    } catch (error: any) {
      if (error.response && error.response.status == 400) {
        const message = error.response.data.error
        Swal.fire('Error', message, 'error')
      }
      throw new Error('Ocurrió algun error')
    }
  }
  const postChangeRentalState = async (body: any) => {
    try {
      console.log('CAMBIANDO EL ESTADO');
      console.log(body)
      await api.post('/leases/change_state/', body)
      getCurrentLeaseState(body.rental)
    } catch (error: any) {
      if (error.response && error.response.status == 400) {
        console.log(error.response)
        const message = error.response.data.error
        Swal.fire('Error', message, 'error')
      }
      throw new Error('Ocurrió algun error')
    }
  }

  const patchUpdateTime = async (productId: number, body: object) => {
    try {
      console.log('EDITANDO LA HORA DE UN PRODUCTO SELECCIONADO');
      const { data } = await api.patch(`/leases/selected_product/${productId}`, body);
      console.log(data)
      // dispatch(refreshCustomer());
      Swal.fire('Se edito correctamente la fecha', '', 'success');
    } catch (error: any) {
      if (error.response && error.response.status == 400) {
        const message = error.response.data.error
        Swal.fire('Error', message, 'error')
      }
      throw new Error('Ocurrió algun error')
    }
  }

  return {
    states,
    rentalInformation,
    currentRentalState,
    /* */
    getLeaseState,
    getRental,
    getCurrentLeaseState,
    postChangeRentalState,
    patchUpdateTime
  }
}