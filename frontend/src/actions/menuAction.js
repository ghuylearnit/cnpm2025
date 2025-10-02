// src/actions/menuAction.js
import axios from 'axios';
import {
  GET_MENU_REQUEST,
  GET_MENU_SUCCESS,
  GET_MENU_FAIL,
} from '../constants/menuConstant';

export const getMenus = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_MENU_REQUEST });

    const res = await axios.get(`/api/v1/eats/stores/${id}/menus`);
    const payload = res?.data;

    // Backend có thể trả { restaurant, menu:[...] } hoặc trả thẳng [...]
    const normalized = Array.isArray(payload) ? payload : (payload?.menu || []);

    dispatch({
      type: GET_MENU_SUCCESS,
      payload: normalized,               // luôn là mảng [{ category, items:[...] }]
    });
  } catch (error) {
    dispatch({
      type: GET_MENU_FAIL,
      payload:
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load menus',
    });
  }
};
