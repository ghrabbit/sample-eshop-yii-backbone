<?php
require('RestController.php');

class SettingsController extends RestController
{
	protected $selfModel = 'SettingsForm';
	public  $title = "eShop Settings Management";

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
	
	protected function modelCreate(CModel $model, array $data)
	{
		$this->modelGetData($model, $data);
		///$this->modelUpdate($model, $data);
	}
	
	protected function modelGetData(CModel $model, array $data)
	{
		$user = User::current();
		if(isset($user)) //maybe not logged in
		{
			///$this->debug_array($user->attributes);
			$model->attributes =  $user->attributes;
		}	
		$this->sendResponse(200, CJSON::encode($model));
	}
	
	protected function modelUpdate(CModel $model, array $data)
	{
		Yii::log('modelUpdate is called request='.Yii::app()->request->requestType,'warning');
		$model->attributes=$data;
		if($model->validate())
		{
			$user = User::current();
			if(!User::checkUsernameOrEmail($data['username'],$data['email'], $user))
			{
					//$user = new User;
					$user->attributes = $model->attributes;
					///$user->password = md5($model->password);
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
							'Your settings is stored':Yii::t('longtext','privdata1');
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
}
