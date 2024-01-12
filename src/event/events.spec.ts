import axios from 'axios';
import { ErrorTypeEnum } from './errors';
import { events } from '../database/migrations/events.data';

async function bookEvent(
  name: string,
  startDate: string,
  endDate: string,
): Promise<any> {
  const axiosInstance = axios.create();
  const url = 'http://localhost:3000/events';
  const data = {
    name: name,
    startDate: startDate,
    endDate: endDate,
  };

  try {
    const response = await axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error:', error.response.data);
    return error.response.data;
  }
}

async function deleteEvent(id: number): Promise<any> {
  const axiosInstance = axios.create();
  const url = 'http://localhost:3000/events/' + id.toString();

  try {
    const response = await axiosInstance.delete(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

describe('validation', () => {
  test('startDate later than endDate', async () => {
    const res = await bookEvent('some', '2025-12-31', '2025-01-01');
    expect(res.message).toEqual(ErrorTypeEnum.CANNOT_BOOK_IN_PAST);
  });

  test('booking past date', async () => {
    const res = await bookEvent('some', '2022-01-01', '2023-01-01');
    expect(res.message).toEqual(ErrorTypeEnum.CANNOT_BOOK_IN_PAST);
  });

  test('invalid input dates', async () => {
    const res = await bookEvent('some', 'sdfasdf', 'w01');
    expect(res.statusCode).toBe(400);
  });

  test('invalid input name', async () => {
    const eventName = generateRandomString(33);
    const res = await bookEvent(eventName, 'sdfasdf', 'w01');
    expect(res.statusCode).toBe(400);
  });
});

describe('business logic', () => {
  test('not unique name', async () => {
    const res = await bookEvent(events[0].name, '2025-01-01', '2025-01-02');
    expect(res.message).toEqual(ErrorTypeEnum.NAME_ALREADY_TAKEN);
  });

  // {
  //   id: 17,
  //   name: 'First',
  //   startDate: '2024-02-03',
  //   endDate: '2024-02-04',
  // },
  // {
  //   id: 18,
  //   name: 'Second',
  //   startDate: '2024-02-08',
  //   endDate: '2024-02-18',
  // },
  // {
  //   id: 19,
  //   name: 'Third',
  //   startDate: '2024-02-25',
  //   endDate: '2024-02-27',
  // },
  // {
  //   id: 20,
  //   name: 'Fourth',
  //   startDate: '2024-02-20',
  //   endDate: '2024-02-20',
  // },
  const eventName = generateRandomString(10);

  test('interval overlapping 1', async () => {
    const res = await bookEvent(eventName, '2024-02-10', '2024-02-15');
    expect(res.message).toEqual(ErrorTypeEnum.DATE_INTERVAL_ALREADY_BOOKED);
  });

  test('interval overlapping 2', async () => {
    const res = await bookEvent(eventName, '2024-02-20', '2024-02-21');
    expect(res.message).toEqual(ErrorTypeEnum.DATE_INTERVAL_ALREADY_BOOKED);
  });

  test('interval overlapping 3', async () => {
    const res = await bookEvent(eventName, '2030-01-01', '2030-01-01');
    await deleteEvent(res.id);
    expect(res.name).toBe(eventName);
  });
});

function generateRandomString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}
