import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import { getUserObjByUserId } from "../services/userService";
import { convertBufferToJavasciptObject } from "../helpers";
import { evaluateTransactionUserObjAnyParam, submitTransaction } from "../app";

const DistributorController = {
	getAllProducts: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const shippingStatus = String(req.query.shippingStatus);

			const userObj = await getUserObjByUserId(user.userId);
			const queryObj = {
				address: userObj.address,
				shippingStatus: shippingStatus
			};

			const productsBuffer = await evaluateTransactionUserObjAnyParam(
				"GetAllProductsByShippingStatus",
				userObj,
				queryObj
			);
			const products = await convertBufferToJavasciptObject(productsBuffer);

			return res.json({
				data: products,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	updateProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);
			const productObj = req.body.productObj;

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			await submitTransaction("UpdateProduct", userObj, productObj);

			return res.json({
				data: null,
				message: "successfully",
				error: null
			});
		} catch (error) {
			console.log("updateProduct", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}
};

export default DistributorController;
