<?php
require('RestController.php');

class SignupController extends RestController
{
	protected $selfModel = 'SignupForm';
	public  $title = "eShop Signup Management";

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
		$model->attributes = $data;
		if($model->validate())
			{
				if(!User::checkUsernameOrEmail($data['username'],$data['email']))
				{
					$user = new User;
					$user->attributes = $data;
					//$this->debug_array($user->attributes);
					$connection=Yii::app()->db; 
					$transaction=$connection->beginTransaction();
					try 
					{
						$user->save();
					}catch(Exception $e)
					{
						$transaction->rollback();
						$this->sendResponse(200, CJSON::encode(array(
							'valid'=>false, 
							'message'=>array('exception'=>$e->message))));	
					}
					$transaction->commit();
									
					$message =	(Yii::app()->language == 'en_us')?
							'Thank you for signup.':Yii::t('longtext','signup1');
					$this->sendResponse(200, CJSON::encode(array(
							'valid'=>true, 
							'message'=>array('confirmation'=>$message))));	
					
					/* no mail 
					$headers="From: {Yii::app()->params['adminEmail']}\r\nReply-To: {Yii::app()->params['adminEmail']}";
					mail(Yii::app()->$model->email, 'signup', $model->body,$headers);
					*/
				}else
				{
					$this->sendResponse(200, CJSON::encode(array(
					'valid'=>false, 
					'message'=>array('$'=>"name \"{$data['username']}\" or email \"{$data['email']}\" already in use"))));		
				}
			}else
				$this->sendResponse(200, CJSON::encode(array(
					'valid'=>false, 
					'message'=>$model->errors)));
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
