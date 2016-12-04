<?php

class AccountController extends Controller
{
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
	
	public function accessRules()
	{
		return array(
			array('allow',  // allow all users to perform 'index' and 'view' actions
				'actions'=>array( 
					'login', 'isLoggedIn', 'contact', 'logout', 'user', 'signup', 'forgotPassword','settings','password'),
				'users'=>array('*'),
			),
			array('allow', // allow authenticated user to perform 'create' and 'update' actions
				'actions'=>array('create','update'),
				'users'=>array('@'),
			),
			array('allow', // allow admin user to perform 'admin' and 'delete' actions
				'actions'=>array('admin','delete',),
				'users'=>array('admin'),
			),
			array('deny',  // deny all users
				'users'=>array('*'),
			),
		);
	}
	

/**********************/

	
	public function actionUser() 
	{
		$user = User::current();	
		if(!isset($user))
        {
			$user = new User;
            $user->username = Yii::t('app','guest');
        }    
		//Yii::log('CALL data for user:'.$user->username,'warning');
		
		if(Yii::app()->request->isAjaxRequest)		
		{
			//Yii::log('CALL data for user:'.CJSON::encode($user),'warning');
			$attr = $user->attributes;
			$attr['authenticated'] = !Yii::app()->user->isGuest;
			$this->sendResponse(200, CJSON::encode($attr));
		}
		$this->ajax_required();
	}
    
    
    /**
	 * Displays the login page
	 */
	public function login()
	{
		$model=new LoginForm;
		// collect user input data
		if(isset($_POST) && count($_POST))
		{
			$_POST['rememberMe'] = isset($_POST['rememberMe']) && ($_POST['rememberMe'] == 'on') ?1:0;
				
			$model->attributes=$_POST;
			// validate user input and redirect to the previous page if valid
			if($model->validate() && ($model->login()===UserIdentity::ERROR_NONE) )
			{
				$this->redirect(isset(Yii::app()->user->returnUrl)?
                  Yii::app()->user->returnUrl:Yii::app()->getBaseUrl(true).'/home');
			}	
		} 

		$this->render('form',array('model'=>$model, 
			'title'=>Yii::t('app','Login'),
			'headerTemplate'=>'loginHeader',
			'template'=>'login',
		));
	}
	
	public function actionLogin()
	{
		$request = Yii::app()->request;
		if($request->isAjaxRequest) 
		{	//	return false;
			$this->redirect('login/model');
		}else
			$this->login();
		
	}
    
    /**
	 * Logs out the current user and redirect to homepage.
	 */
	public function actionLogout()
	{

		Yii::app()->user->logout();
        if(Yii::app()->request->isAjaxRequest)		
		{
			//Yii::log('CALL data for user:'.CJSON::encode($user),'warning');
			$user = new User();
            $attr = $user->attributes;
			$attr['username'] = Yii::t('app','guest');
            $attr['authenticated'] = !Yii::app()->user->isGuest;
			$this->sendResponse(200, CJSON::encode($attr));
		}else $this->redirect(Yii::app()->homeUrl);
	}
	
}
