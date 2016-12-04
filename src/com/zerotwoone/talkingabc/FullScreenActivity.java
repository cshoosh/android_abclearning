package com.zerotwoone.talkingabc;

import android.app.Activity;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;

public abstract class FullScreenActivity extends Activity {
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {	    
		super.onCreate(savedInstanceState);
		
		requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN);
        
        Static.InitializeStatic(this);
	}
}
