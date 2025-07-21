import {  Response, NextFunction } from 'express';
import { controller, httpPost, httpGet, httpPut, httpDelete, requestBody, requestParam, response, next } from 'inversify-express-utils';
import { inject } from 'inversify';
import { IOrderService } from '@/interfaces/IOrderService';
import { TYPES } from '@/types';
import { validate, validateParams } from '@/middlewares/validationMiddleware';
import { createOrderSchema, updateOrderSchema } from '@/dtos/orderSchema';
import { userIdSchema } from '@/dtos/userIdSchema';
import { orderIdSchema } from '@/dtos/orderIdSchema';
import { HTTP_STATUS } from '@/consts';

@controller('/orders')
export class OrderController {

  constructor(@inject(TYPES.IOrderService) private orderService: IOrderService) {}

  @httpPost('/', validate(createOrderSchema))
  public async createOrder(
    @requestBody() body: { userId: number; productId: number; quantity: number },
    @response() res: Response,
    @next() next: NextFunction
  ) {
    try {
      const order = await this.orderService.createOrder(body.userId, body.productId, body.quantity);
      res.status(HTTP_STATUS.CREATED).json(order);
    } catch (error: any) {
      next(error);
    }
  }

  @httpGet('/:userId', validateParams(userIdSchema))
  public async getOrdersByUserId(@requestParam('userId') userId: number, @response() res: Response, @next() next: NextFunction) {
    try {
      const orders = await this.orderService.getOrdersByUserId(userId);
      res.status(HTTP_STATUS.OK).json(orders);
    } catch (error: any) {
      next(error);
    }
  }

  @httpGet('/details/:orderId', validateParams(orderIdSchema))
  public async getOrderById(@requestParam('orderId') orderId: number, @response() res: Response, @next() next: NextFunction) {
    try {
      const order = await this.orderService.getOrderById(orderId);
      res.status(HTTP_STATUS.OK).json(order);
    } catch (error: any) {
      next(error);
    }
  }

  @httpPut('/status/:orderId', validateParams(orderIdSchema)) // Changed to PUT for updating status
  public async updateOrderStatus(
    @requestParam('orderId') orderId: number,
    @requestBody() body: { status: string },
    @response() res: Response,
    @next() next: NextFunction
  ) {
    try {
      const order = await this.orderService.updateOrderStatus(orderId, body.status);
      res.status(HTTP_STATUS.OK).json(order);
    } catch (error: any) {
      next(error);
    }
  }

  @httpPut('/:orderId', validateParams(orderIdSchema), validate(updateOrderSchema)) // Changed to PUT for updating order details
  public async updateOrder(
    @requestParam('orderId') orderId: number,
    @requestBody() body: { quantity: number }, // Only quantity is updatable
    @response() res: Response,
    @next() next: NextFunction
  ) {
    try {
      const order = await this.orderService.updateOrder(orderId, body.quantity);
      res.status(HTTP_STATUS.OK).json(order);
    } catch (error: any) {
      next(error);
    }
  }

  @httpDelete('/:orderId', validateParams(orderIdSchema)) // Changed to DELETE for deleting order
  public async deleteOrder(
    @requestParam('orderId') orderId: number,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    try {
      await this.orderService.deleteOrder(orderId); // Assuming userId is not needed for delete
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error: any) {
      next(error);
    }
  }
}
