<?php
require('RestController.php');

class ForgotPasswordController extends RestController
{
	protected $selfModel = 'ForgotPasswordForm';
	public  $title = "eShop ForgotPassword Management";

	public function actions()
	{
		return array(
			// captcha action renders the CAPTCHA image displayed on the contact page
			'captcha'=>array(
				'class'=>'CCaptchaAction',
				'backColor'=>0xFFFFFF,
			),
		);
	}	

	

	protected function modelUpdate(CModel $model, array $data)
	{
		///Yii::log('modelUpdate is called request='.Yii::app()->request->requestType,'warning');
		$model->setAttributes($data);
		Yii::log('TRY validate forgotPasswordForm','warning');
		if($model->validate())
		{
			Yii::log('TRY validate forgotPasswordForm is OK','warning');
			try
			{
					$user = Account::resetPassword($data['email']);
					$this->sendResponse(200, CJSON::encode(array(
							'valid'=>isset($user), 
							'message'=>isset($user)?array('confirmation'=>'|)'):
								array('$'=>"email \"{$data['email']}\" not registered")
					)));	
			}catch(Exception $e)
			{
					$this->sendResponse(200, CJSON::encode(array(
							'valid'=>false, 
							'message'=>array('exception'=>$e->message))));	
			}
		}else{
			Yii::log('TRY validate forgotPasswordForm is BAD','warning');
			$this->sendResponse(200, CJSON::encode(array(
					'valid'=>false, 
					'message'=>$model->errors)));
		}			
	}

	/*
	public function actionIndex()
	{
		$this->render('index');
	}
	*/
	// -----------------------------------------------------------
	// Uncomment the following methods and override them if needed
	/*
	public function filters()
	{
		// return the filter configuration for this controller, e.g.:
		return array(
			'inlineFilterName',
			array(
				'class'=>'path.to.FilterClass',
				'propertyName'=>'propertyValue',
			),
		);
	}

	public function actions()
	{
		// return external action classes, e.g.:
		return array(
			'action1'=>'path.to.ActionClass',
			'action2'=>array(
				'class'=>'path.to.AnotherActionClass',
				'propertyName'=>'propertyValue',
			),
		);
	}
	*/
	
}
