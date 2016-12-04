package com.zerotwoone.talkingabc.animation;

import java.util.Random;

public enum AnimationList {
	Circle,
	Line,
	Square,
	ZigZag,
	Check,
	Spot;
	
	public static BaseAnimationDrawable getAnimation (AnimationList list, int bgcolor) {
		switch (list) {
		case Circle:
			return new CircleAnimation(bgcolor, 20f);
		case Line:
			return new LineBackgroundAnimation(bgcolor, 60f);
		case Square:
			return new SquareAnimation(bgcolor, 75f);
		case ZigZag:
			return new ZigZagAnimation(bgcolor, 90f, 40f);
		case Check:
			return new CheckAnimation(bgcolor, 40f);
		case Spot:
			return new SpotAnimation(bgcolor, 20f);
		default:
			return new LineBackgroundAnimation(bgcolor, 60f);
		}
	}
	
	public static AnimationList getRandom () {
		return values()[new Random().nextInt(values().length)];
	}
	
	public static BaseAnimationDrawable getRandomAnimation (int bgcolor) {
		return getAnimation(values()[new Random().nextInt(values().length)], bgcolor);
	}
}
