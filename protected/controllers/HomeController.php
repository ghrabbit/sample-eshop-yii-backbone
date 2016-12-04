<?php

require_once dirname(__FILE__).'/../components/RestController.php';

class HomeController extends RestController
{
	/**
	 * Declares class-based actions.
	 */
	public function actions()
	{
		return array(
			// captcha action renders the CAPTCHA image displayed on the contact page
			'captcha'=>array(
				'class'=>'CCaptchaAction',
				'backColor'=>0xFFFFFF,
			),
			
			// page action renders "static" pages stored under 'protected/views/site/pages'
			// They can be accessed via: index.php?r=site/page&view=FileName
			'page'=>array(
				'class'=>'CViewAction',
			),
		);
	}

	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public function actionIndex()
	{
		// renders the view file 'protected/views/site/index.php'
		// not using the default layout 'protected/views/layouts/main.php'

		$pageNo = isset($_GET['page'])?$_GET['page']:1;
		$pageSize = isset($_GET['pageSize'])?$_GET['pageSize']:6;
		
        /*
		$this->render('index', array(
			'title'=>Yii::t('app','Closeout'),
			'pageNo'=> $pageNo,
			'pageSize' => $pageSize,
		));
        */
          $this->startBackbone([
			'title'=>Yii::t('app','Closeout'),
			'pageNo'=> $pageNo,
			'pageSize' => $pageSize,
		]);
	}
    
    public function actionAltIndex()
	{
		$pageNo = isset($_GET['page'])?$_GET['page']:1;
		$pageSize = isset($_GET['pageSize'])?$_GET['pageSize']:6;
		
        $this->startBackbone([
			'title'=>Yii::t('app','Closeout'),
			'pageNo'=> $pageNo,
			'pageSize' => $pageSize,
		]);
	}


	/**
	 * This is the action to handle external exceptions.
	 */
	public function actionError()
	{
		if($error=Yii::app()->errorHandler->error)
		{
			if(Yii::app()->request->isAjaxRequest)
				echo $error['message'];
			
			else if ($error['code'] == 401)
				$this->redirect('login');
					
			else
				$this->render('error', $error);
		}
	}

	/**
	 * Displays the contact page
	 */
	public function actionContact()
	{
        $request = Yii::app()->request;
		if($request->isAjaxRequest) 
		{	//	return false;
			$this->redirect('contact/model');
		}
	}
	
	public function actionLang($id)
	{
		$app = Yii::app();
		$app->setLanguage($id);
		$app->session['ulang']=$id;
		$this->redirect($app->request->urlReferrer);
	}
    
    /*
     * *************************************************
     */
     
     /*CRUD for SignupForm*/
	public function actionTopNavbar() 
	{
		$request = Yii::app()->request;
		if($request->isAjaxRequest) 
		{	//	return false;
			//Yii::log('request->requestType='.$request->requestType,'warning');
			switch($request->requestType) 
			{
			//create
			case 'POST' : break;
			//read  js fetch
			case 'GET' : 
			{
				$model = new TopNavbarHelper;
				$this->sendResponse(200, CJSON::encode(array_merge(
					array('labels'=>$model->attributeLabels()),
					$model->attributes)));
			}break;
			//update
			case 'PUT' : break;
			}//endswitch
		}
	}
     
    public function actionUserMenu() 
	{
		$request = Yii::app()->request;
		if($request->isAjaxRequest) 
		{	//	return false;
			//Yii::log('request->requestType='.$request->requestType,'warning');
			switch($request->requestType) 
			{
			//create
			case 'POST' : break;
			//read  js fetch
			case 'GET' : 
			{
				$model = new UserMenuHelper;
				$this->sendResponse(200, CJSON::encode(array_merge(
					array('labels'=>$model->attributeLabels()),
					$model->attributes)));
			}break;
			//update
			case 'PUT' : break;
			}//endswitch
		}
	} 

    public function actionCartMenu() 
	{
		$request = Yii::app()->request;
		if($request->isAjaxRequest) 
		{	
			//Yii::log('request->requestType='.$request->requestType,'warning');
			switch($request->requestType) 
			{
			//create
			case 'POST' : break;
			//read  js fetch
			case 'GET' : 
			{
				$model = new CartMenuHelper;
				$this->sendResponse(200, CJSON::encode(array_merge(
					array('labels'=>$model->attributeLabels()),
					$model->attributes)));
			}break;
			//update
			case 'PUT' : break;
			}//endswitch
		}

    }  
    
    public function actionFooter() 
	{
		$request = Yii::app()->request;
		if($request->isAjaxRequest) 
		{	
			//Yii::log('request->requestType='.$request->requestType,'warning');
			switch($request->requestType) 
			{
			//create
			case 'POST' : break;
			//read  js fetch
			case 'GET' : 
			{
				$model = new FooterHelper;
				/*
                $this->sendResponse(200, CJSON::encode(array_merge(
					array('labels'=>$model->attributeLabels()),
					$model->attributes)));
                */ 
                $this->sendResponse(200, CJSON::encode(array('labels'=>$model->attributeLabels())));   
			}break;
			//update
			case 'PUT' : break;
			}//endswitch
		}
    }  
    
    /*CRUD for language*/
	public function actionLanguage() 
	{
		$request = Yii::app()->request;
		if($request->isAjaxRequest) 
		{	
			//Yii::log('request->requestType='.$request->requestType,'warning');
			switch($request->requestType) 
			{
			//create
			case 'POST' : $this->langUpdate();
			break;
			//read  js fetch
			case 'GET' : 
			{
				//Yii::log('GET LANG='.Yii::app()->language,'warning');
                $this->sendResponse(200, CJSON::encode(array(
                  'id'=> Yii::app()->getLanguage(),
                )));
			}break;
			//update
			case 'PUT' :
			{
				$this->langUpdate();
			}break;
			}//endswitch
		}
		//?
	}
	
	function langUpdate()
	{
		$data = $this->getInputAsJson();
		$app = Yii::app();
		try
		{
			/*if(isset($data)) {
              if(is_array($data))    
                utils::debug_array($data);
              else Yii::log('SET LANG data='.$data,'warning');  
            }*/
            $app->setLanguage($data['id']);
			$session = $app->getSession();
			$session['ulang'] = $data['id'];
			//Yii::log('SET LANG='.$app->language.'  session[ulang]='.$session['ulang'].' data[id]='.$data['id'],'warning');
		}catch(Exception $e)
		{
			$this->sendResponse(200, CJSON::encode(array(
				'valid'=>false, 
				'message'=>$e->message
            )));	
		}
		$this->sendResponse(200, CJSON::encode(array(
			'valid'=>true, 
			'message'=>array('confirmation'=>'Current language is '.$app->getLanguage()),
        )));	
	} 
    
    public function actionMessages($lang = null) 
	{
		$request = Yii::app()->request;
		if($request->isAjaxRequest) 
		{	
			switch($request->requestType) 
			{
			//create
			case 'POST' : break;
			//read  js fetch
			case 'GET' : 
			{
				$msgs = new CPhpSourcePlus;//Yii::app()->messages;
                
				$this->sendResponse(200, CJSON::encode(utils::toAttributeArray($msgs->messages($lang))));
			}break;
			//update
			case 'PUT' : break;
			}//endswitch
		}else
        {
          $msgs = new CPhpSourcePlus;//Yii::app()->messages;
          ///$msgs->init();
          $this->sendResponse(200, CJSON::encode(utils::toAttributeArray($msgs->messages())));
        }
	}
}
