import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// ─── @GET /api/messages/conversations ──────────────────────────────────────
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      isArchived: false,
    })
      .populate("participants", "name avatar title isOnline lastSeen")
      .populate("lastMessage")
      .sort("-lastMessageAt");

    // Add unread count for current user
    const enriched = conversations.map((conv) => {
      const unread = conv.unreadCount.get(req.user._id.toString()) || 0;
      const otherParticipant = conv.participants.find(
        (p) => p._id.toString() !== req.user._id.toString()
      );
      return {
        ...conv.toObject(),
        unreadCount: unread,
        otherParticipant,
      };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      conversations: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @GET /api/messages/conversations/:userId ──────────────────────────────
// Get or create conversation with a user
export const getOrCreateConversation = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;

    // Check if other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, otherUserId] },
    }).populate("participants", "name avatar title isOnline lastSeen");

    // Create if doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, otherUserId],
      });
      conversation = await conversation.populate(
        "participants",
        "name avatar title isOnline lastSeen"
      );
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @GET /api/messages/:conversationId ────────────────────────────────────
export const getMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Verify user is part of conversation
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this conversation.",
      });
    }

    const [messages, total] = await Promise.all([
      Message.find({
        conversation: req.params.conversationId,
        isDeleted: false,
      })
        .populate("sender", "name avatar")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit)),
      Message.countDocuments({
        conversation: req.params.conversationId,
        isDeleted: false,
      }),
    ]);

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        receiver: req.user._id,
        isRead: false,
      },
      { isRead: true, readAt: new Date() }
    );

    // Reset unread count
    conversation.unreadCount.set(req.user._id.toString(), 0);
    await conversation.save();

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      messages: messages.reverse(), // Return in chronological order
    });
  } catch (error) {
    next(error);
  }
};

// ─── @POST /api/messages/:conversationId ────────────────────────────────────
export const sendMessage = async (req, res, next) => {
  try {
    const { content, messageType = "text" } = req.body;

    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this conversation.",
      });
    }

    if (conversation.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "This conversation has been blocked.",
      });
    }

    // Get receiver
    const receiverId = conversation.participants.find(
      (p) => p.toString() !== req.user._id.toString()
    );

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      receiver: receiverId,
      content,
      messageType,
      attachments: req.body.attachments || [],
    });

    await message.populate("sender", "name avatar");

    // Update conversation last message
    conversation.lastMessage = message._id;
    conversation.lastMessageText = content.substring(0, 100);
    conversation.lastMessageAt = new Date();

    // Increment unread count for receiver
    const currentUnread = conversation.unreadCount.get(receiverId.toString()) || 0;
    conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);

    await conversation.save();

    // Send notification
    await Notification.create({
      recipient: receiverId,
      sender: req.user._id,
      type: "new_message",
      title: `New message from ${req.user.name}`,
      message: content.substring(0, 100),
      relatedUser: req.user._id,
      link: `/messages/${conversation._id}`,
      icon: "message",
      color: "blue",
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @DELETE /api/messages/:messageId ──────────────────────────────────────
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages.",
      });
    }

    message.isDeleted = true;
    message.content = "This message was deleted.";
    message.deletedAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: "Message deleted.",
    });
  } catch (error) {
    next(error);
  }
};
