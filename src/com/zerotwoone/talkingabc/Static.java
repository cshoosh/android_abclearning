package com.zerotwoone.talkingabc;

import java.util.Random;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.os.Build;
import en.com.zerotwoone.abclearning.R;

public class Static {
	
	public static final Paint TEXT_PAINT = new Paint();
	public static Typeface CUBANO;
	public static final int TRANSPARENT_WHITE = 0x33FFFFFF;
	public static Bitmap COVER;
	
	
	static{
		TEXT_PAINT.setColor(Color.BLACK);
		TEXT_PAINT.setTextSize(24f);
	}
	
	public static int parseletterToSoundresource (String letter) {
		if (letter.equals("A"))
			return R.raw.a;
		else if (letter.equals("B"))
			return R.raw.b;
		else if (letter.equals("C"))
			return R.raw.c;
		else if (letter.equals("D"))
			return R.raw.d;
		else if (letter.equals("E"))
			return R.raw.e;
		else if (letter.equals("F"))
			return R.raw.f;
		else if (letter.equals("G"))
			return R.raw.g;
		else if (letter.equals("H"))
			return R.raw.h;
		else if (letter.equals("I"))
			return R.raw.i;
		else if (letter.equals("J"))
			return R.raw.j;
		else if (letter.equals("K"))
			return R.raw.k;
		else if (letter.equals("L"))
			return R.raw.l;
		else if (letter.equals("M"))
			return R.raw.m;
		else if (letter.equals("N"))
			return R.raw.n;
		else if (letter.equals("O"))
			return R.raw.o;
		else if (letter.equals("P"))
			return R.raw.p;
		else if (letter.equals("Q"))
			return R.raw.q;
		else if (letter.equals("R"))
			return R.raw.r;
		else if (letter.equals("S"))
			return R.raw.s;
		else if (letter.equals("T"))
			return R.raw.t;
		else if (letter.equals("U"))
			return R.raw.u;
		else if (letter.equals("V"))
			return R.raw.v;
		else if (letter.equals("W"))
			return R.raw.w;
		else if (letter.equals("X"))
			return R.raw.x;
		else if (letter.equals("Y"))
			return R.raw.y;
		else if (letter.equals("Z"))
			return R.raw.z;
		
		return R.raw.a;
	}
	
	public static int parseletterToAnimalSoundresource (String letter) {
		if (letter.equals("A"))
			return R.raw.alligator;
		else if (letter.equals("B"))
			return R.raw.bear;
		else if (letter.equals("C"))
			return R.raw.cow;
		else if (letter.equals("D"))
			return R.raw.dog;
		else if (letter.equals("E"))
			return R.raw.elephant;
		else if (letter.equals("F"))
			return R.raw.frog;
		else if (letter.equals("G"))
			return R.raw.giraffe;
		else if (letter.equals("H"))
			return R.raw.hippo;
		else if (letter.equals("I"))
			return R.raw.iguana;
		else if (letter.equals("J"))
			return R.raw.jelly_fish;
		else if (letter.equals("K"))
			return R.raw.kangaroo;
		else if (letter.equals("L"))
			return R.raw.lion;
		else if (letter.equals("M"))
			return R.raw.monkey;
		else if (letter.equals("N"))
			return R.raw.newt;
		else if (letter.equals("O"))
			return R.raw.octopus;
		else if (letter.equals("P"))
			return R.raw.panda;
		else if (letter.equals("Q"))
			return R.raw.quail;
		else if (letter.equals("R"))
			return R.raw.rhino;
		else if (letter.equals("S"))
			return R.raw.snail;
		else if (letter.equals("T"))
			return R.raw.turtle;
		else if (letter.equals("U"))
			return R.raw.unicorn;
		else if (letter.equals("V"))
			return R.raw.vulture;
		else if (letter.equals("W"))
			return R.raw.wolf;
		else if (letter.equals("X"))
			return R.raw.xerus;
		else if (letter.equals("Y"))
			return R.raw.yalk;
		else if (letter.equals("Z"))
			return R.raw.zebra;
		
		return R.raw.alligator;
	}
	
	public static int getDrawableResource(int no) {
		switch (no) {
		case 0:
			return R.drawable.a_wave_0;
		case 1:
			return R.drawable.b_wave_0;
		case 2:
			return R.drawable.c_wave_0;
		case 3:
			return R.drawable.d_wave_0;
		case 4:
			return R.drawable.e_wave_0;
		case 5:
			return R.drawable.f_wave_0;
		case 6:
			return R.drawable.g_wave_0;
		case 7:
			return R.drawable.h_wave_0;
		case 8:
			return R.drawable.i_wave_0;
		case 9:
			return R.drawable.j_wave_0;
		case 10:
			return R.drawable.k_wave_0;
		case 11:
			return R.drawable.l_wave_0;
		case 12:
			return R.drawable.m_wave_0;
		case 13:
			return R.drawable.n_wave_0;
		case 14:
			return R.drawable.o_wave_0;
		case 15:
			return R.drawable.p_wave_0;
		case 16:
			return R.drawable.q_wave_0;
		case 17:
			return R.drawable.r_wave_0;
		case 18:
			return R.drawable.s_wave_0;
		case 19:
			return R.drawable.t_wave_0;
		case 20:
			return R.drawable.u_wave_0;
		case 21:
			return R.drawable.v_wave_0;
		case 22:
			return R.drawable.w_wave_0;
		case 23:
			return R.drawable.x_wave_0;
		case 24:
			return R.drawable.y_wave_0;
		case 25:
			return R.drawable.z_wave_0;
		default:
			return R.drawable.a_wave_0;
		}
	}
	
	public static Drawable parseletterToDrawable (Context cntx, String letter) {
		if (letter.equals("A"))
			return getCompatDrawable(cntx, R.drawable.a_wave);
		else if (letter.equals("B"))
			return getCompatDrawable(cntx, R.drawable.b_wave);
		else if (letter.equals("C"))
			return getCompatDrawable(cntx, R.drawable.c_wave);
		else if (letter.equals("D"))
			return getCompatDrawable(cntx, R.drawable.d_wave);
		else if (letter.equals("E"))
			return getCompatDrawable(cntx, R.drawable.e_wave);
		else if (letter.equals("F"))
			return getCompatDrawable(cntx, R.drawable.f_wave);
		else if (letter.equals("G"))
			return getCompatDrawable(cntx, R.drawable.g_wave);
		else if (letter.equals("H"))
			return getCompatDrawable(cntx, R.drawable.h_wave);
		else if (letter.equals("I"))
			return getCompatDrawable(cntx, R.drawable.i_wave);
		else if (letter.equals("J"))
			return getCompatDrawable(cntx, R.drawable.j_wave);
		else if (letter.equals("K"))
			return getCompatDrawable(cntx, R.drawable.k_wave);
		else if (letter.equals("L"))
			return getCompatDrawable(cntx, R.drawable.l_wave);
		else if (letter.equals("M"))
			return getCompatDrawable(cntx, R.drawable.m_wave);
		else if (letter.equals("N"))
			return getCompatDrawable(cntx, R.drawable.n_wave);
		else if (letter.equals("O"))
			return getCompatDrawable(cntx, R.drawable.o_wave);
		else if (letter.equals("P"))
			return getCompatDrawable(cntx, R.drawable.p_wave);
		else if (letter.equals("Q"))
			return getCompatDrawable(cntx, R.drawable.q_wave);
		else if (letter.equals("R"))
			return getCompatDrawable(cntx, R.drawable.r_wave);
		else if (letter.equals("S"))
			return getCompatDrawable(cntx, R.drawable.s_wave);
		else if (letter.equals("T"))
			return getCompatDrawable(cntx, R.drawable.t_wave);
		else if (letter.equals("U"))
			return getCompatDrawable(cntx, R.drawable.u_wave);
		else if (letter.equals("V"))
			return getCompatDrawable(cntx, R.drawable.v_wave);
		else if (letter.equals("W"))
			return getCompatDrawable(cntx, R.drawable.w_wave);
		else if (letter.equals("X"))
			return getCompatDrawable(cntx, R.drawable.x_wave);
		else if (letter.equals("Y"))
			return getCompatDrawable(cntx, R.drawable.y_wave);
		else if (letter.equals("Z"))
			return getCompatDrawable(cntx, R.drawable.z_wave);
		
		return getCompatDrawable(cntx, R.drawable.a_wave);
	}
	
	@SuppressWarnings("deprecation")
	@TargetApi(Build.VERSION_CODES.LOLLIPOP) 
	private static Drawable getCompatDrawable(Context context, int id) {
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
			return context.getResources().getDrawable(id, context.getTheme());
		else
			return context.getResources().getDrawable(id);
	}
	
	public static String parsetoletter(int no) {
		switch (no) {
		case 0:
			return "A";
		case 1:
			return "B";
		case 2:
			return "C";
		case 3:
			return "D";
		case 4:
			return "E";
		case 5:
			return "F";
		case 6:
			return "G";
		case 7:
			return "H";
		case 8:
			return "I";
		case 9:
			return "J";
		case 10:
			return "K";
		case 11:
			return "L";
		case 12:
			return "M";
		case 13:
			return "N";
		case 14:
			return "O";
		case 15:
			return "P";
		case 16:
			return "Q";
		case 17:
			return "R";
		case 18:
			return "S";
		case 19:
			return "T";
		case 20:
			return "U";
		case 21:
			return "V";
		case 22:
			return "W";
		case 23:
			return "X";
		case 24:
			return "Y";
		case 25:
			return "Z";

		default:
			return "A";
		}
	}
	
	public static int lighten (int color, float percent) {
		float[] hsv = new float[3];
		
		Color.colorToHSV(color, hsv);
		hsv[2] *= percent; // value component
		color = Color.HSVToColor(hsv);
		
		return color;
	}
	
	public static int darken (int color, float percent) {
		float[] hsv = new float[3];
		
		Color.colorToHSV(color, hsv);
		hsv[2] *= percent; // value component
		color = Color.HSVToColor(hsv);
		
		return color;
	}
	
	public static int getRandomExclaim() {
		int sw = new Random().nextInt(7);
		switch (sw) {
		case 0:
			return R.raw.yeah;
		case 1:
			return R.raw.bravo;
		case 2:
			return R.raw.wow;
		case 3:
			return R.raw.great;
		case 4:
			return R.raw.cool;
		case 5:
			return R.raw.hooray;
		case 6:
			return R.raw.wonderful;
		default:
			return R.raw.yeah;
		}
	}
	
	public static int getRandomColor (Context cntxt) {
		int rand = new Random().nextInt(15);
		switch (rand) {
		case 0:
			return cntxt.getResources().getColor(R.color.purple);
		case 1:
			return cntxt.getResources().getColor(R.color.baby_green);
		case 2:
			return cntxt.getResources().getColor(R.color.biege);
		case 3:
			return cntxt.getResources().getColor(R.color.blue);
		case 4:
			return cntxt.getResources().getColor(R.color.coral_red);
		case 5:
			return cntxt.getResources().getColor(R.color.cream_yellow);
		case 6:
			return cntxt.getResources().getColor(R.color.dark_orange);
		case 7:
			return cntxt.getResources().getColor(R.color.ferozee);
		case 8:
			return cntxt.getResources().getColor(R.color.light_orange);
		case 9:
			return cntxt.getResources().getColor(R.color.navy_blue);
		case 10:
			return cntxt.getResources().getColor(R.color.rosered);
		case 11:
			return cntxt.getResources().getColor(R.color.sea_green);
		case 12:
			return cntxt.getResources().getColor(R.color.sky_blue);
		case 13:
			return cntxt.getResources().getColor(R.color.sky_green);
		case 14:
			return cntxt.getResources().getColor(R.color.purple_pink);

		default:
			return cntxt.getResources().getColor(R.color.purple);
		}
	}
	
	public static String getAnimalName (String letter) {
		if (letter.equals("A"))
			return "ALLIGATOR";
		else if (letter.equals("B"))
			return "BEAR";
		else if (letter.equals("C"))
			return "COW";
		else if (letter.equals("D"))
			return "DOG";
		else if (letter.equals("E"))
			return "ELEPHANT";
		else if (letter.equals("F"))
			return "FROG";
		else if (letter.equals("G"))
			return "GIRAFFE";
		else if (letter.equals("H"))
			return "HIPPO";
		else if (letter.equals("I"))
			return "IGUANA";
		else if (letter.equals("J"))
			return "JELLY FISH";
		else if (letter.equals("K"))
			return "KANGAROO";
		else if (letter.equals("L"))
			return "LION";
		else if (letter.equals("M"))
			return "MONKEY";
		else if (letter.equals("N"))
			return "NEWT";
		else if (letter.equals("O"))
			return "OCTOPUS";
		else if (letter.equals("P"))
			return "PANDA";
		else if (letter.equals("Q"))
			return "QUAIL";
		else if (letter.equals("R"))
			return "RHINO";
		else if (letter.equals("S"))
			return "SNAIL";
		else if (letter.equals("T"))
			return "TURTLE";
		else if (letter.equals("U"))
			return "UNICORN";
		else if (letter.equals("V"))
			return "VULTURE";
		else if (letter.equals("W"))
			return "WOLF";
		else if (letter.equals("X"))
			return "XERUS";
		else if (letter.equals("Y"))
			return "YALK";
		else if (letter.equals("Z"))
			return "ZEBRA";
		
		return "ALLIGATOR";
	}
	
	public static Drawable getMatchBitmap (Context cntxt, String letter) {
		if (letter.equals("A"))
			return getCompatDrawable(cntxt, R.drawable.a);
		else if (letter.equals("B"))
			return getCompatDrawable(cntxt, R.drawable.b);
		else if (letter.equals("C"))
			return getCompatDrawable(cntxt, R.drawable.c);
		else if (letter.equals("D"))
			return getCompatDrawable(cntxt, R.drawable.d);
		else if (letter.equals("E"))
			return getCompatDrawable(cntxt, R.drawable.e);
		else if (letter.equals("F"))
			return getCompatDrawable(cntxt, R.drawable.f);
		else if (letter.equals("G"))
			return getCompatDrawable(cntxt, R.drawable.g);
		else if (letter.equals("H"))
			return getCompatDrawable(cntxt, R.drawable.h);
		else if (letter.equals("I"))
			return getCompatDrawable(cntxt, R.drawable.i);
		else if (letter.equals("J"))
			return getCompatDrawable(cntxt, R.drawable.j);
		else if (letter.equals("K"))
			return getCompatDrawable(cntxt, R.drawable.k);
		else if (letter.equals("L"))
			return getCompatDrawable(cntxt, R.drawable.l);
		else if (letter.equals("M"))
			return getCompatDrawable(cntxt, R.drawable.m);
		else if (letter.equals("N"))
			return getCompatDrawable(cntxt, R.drawable.n);
		else if (letter.equals("O"))
			return getCompatDrawable(cntxt, R.drawable.o);
		else if (letter.equals("P"))
			return getCompatDrawable(cntxt, R.drawable.p);
		else if (letter.equals("Q"))
			return getCompatDrawable(cntxt, R.drawable.q);
		else if (letter.equals("R"))
			return getCompatDrawable(cntxt, R.drawable.r);
		else if (letter.equals("S"))
			return getCompatDrawable(cntxt, R.drawable.s);
		else if (letter.equals("T"))
			return getCompatDrawable(cntxt, R.drawable.t);
		else if (letter.equals("U"))
			return getCompatDrawable(cntxt, R.drawable.u);
		else if (letter.equals("V"))
			return getCompatDrawable(cntxt, R.drawable.v);
		else if (letter.equals("W"))
			return getCompatDrawable(cntxt, R.drawable.w);
		else if (letter.equals("X"))
			return getCompatDrawable(cntxt, R.drawable.x);
		else if (letter.equals("Y"))
			return getCompatDrawable(cntxt, R.drawable.y);
		else if (letter.equals("Z"))
			return getCompatDrawable(cntxt, R.drawable.z);
		
		return getCompatDrawable(cntxt, R.drawable.a);
	}
	
	public static void InitializeStatic (Context context) {
		if (CUBANO == null)
			CUBANO = Typeface.createFromAsset(context.getAssets(), "fonts/cubano.ttf");
		if (COVER == null)
			COVER = BitmapFactory.decodeResource(context.getResources(), R.drawable.cover);
	}
}
