// TODO Persona B: JSON mal formado → 400, resto → 500 (Express lo reconoce por tener 4 parámetros)
export const errorHandler = (error, request, response, next) => {
  next(error);
};
