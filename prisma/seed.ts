import { PrismaClient, RoleType, BotStatus, ArticleStatus, ArticleVisibility, MatchType, WorkflowNodeType, ConversationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding chatbots.ai database...');

  // Clean existing tables in order
  await prisma.auditLog.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.conversationVariable.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.customRecord.deleteMany();
  await prisma.customField.deleteMany();
  await prisma.customCollection.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.service.deleteMany();
  await prisma.customerMetadata.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.workflowEdge.deleteMany();
  await prisma.workflowNode.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.ruleAction.deleteMany();
  await prisma.ruleCondition.deleteMany();
  await prisma.botRule.deleteMany();
  await prisma.knowledgeArticle.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.widgetConfiguration.deleteMany();
  await prisma.botTheme.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.role.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const ownerUser = await prisma.user.create({
    data: {
      email: 'owner@acmesupport.com',
      passwordHash,
      name: 'Sarah Connor',
      jobTitle: 'VP of Customer Experience',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      isSuperAdmin: true
    }
  });

  const agentUser = await prisma.user.create({
    data: {
      email: 'agent@acmesupport.com',
      passwordHash,
      name: 'Alex Rivera',
      jobTitle: 'Senior Support Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isSuperAdmin: false
    }
  });

  console.log(`Created users: ${ownerUser.email}, ${agentUser.email}`);

  // Create Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Acme Support Inc.',
      slug: 'acme-support',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
      description: 'Leading provider of high-grade gadgets, logistics, and customer solutions.',
      industry: 'E-commerce & Logistics',
      websiteUrl: 'https://acme.example.com',
      contactEmail: 'support@acmesupport.com',
      contactPhone: '+1 (800) 555-0199',
      address: '100 Innovation Way, Suite 400, San Francisco, CA 94105',
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      locale: 'en-US',
      businessHours: {
        mon: { open: '08:00', close: '18:00', active: true },
        tue: { open: '08:00', close: '18:00', active: true },
        wed: { open: '08:00', close: '18:00', active: true },
        thu: { open: '08:00', close: '18:00', active: true },
        fri: { open: '08:00', close: '18:00', active: true },
        sat: { open: '10:00', close: '16:00', active: false },
        sun: { open: '10:00', close: '16:00', active: false }
      }
    }
  });

  // Create Workspace Roles
  const ownerRole = await prisma.role.create({
    data: {
      workspaceId: workspace.id,
      name: 'Owner',
      roleType: RoleType.OWNER,
      description: 'Full administrative ownership and workspace control',
      isSystem: true,
      permissions: {
        create: [
          { resource: 'all', action: 'manage' }
        ]
      }
    }
  });

  const agentRole = await prisma.role.create({
    data: {
      workspaceId: workspace.id,
      name: 'Support Agent',
      roleType: RoleType.AGENT,
      description: 'Handles live customer chats, view tickets and customers',
      isSystem: true,
      permissions: {
        create: [
          { resource: 'conversations', action: 'read' },
          { resource: 'conversations', action: 'write' },
          { resource: 'customers', action: 'read' },
          { resource: 'faqs', action: 'read' }
        ]
      }
    }
  });

  // Assign Members
  await prisma.workspaceMember.createMany({
    data: [
      { workspaceId: workspace.id, userId: ownerUser.id, roleId: ownerRole.id },
      { workspaceId: workspace.id, userId: agentUser.id, roleId: agentRole.id }
    ]
  });

  // Categories & Tags
  const catGeneral = await prisma.category.create({
    data: { workspaceId: workspace.id, name: 'General Information', slug: 'general', description: 'Office hours, locations, and corporate info' }
  });
  const catShipping = await prisma.category.create({
    data: { workspaceId: workspace.id, name: 'Shipping & Delivery', slug: 'shipping', description: 'Delivery speeds, tracking, and policies' }
  });
  const catReturns = await prisma.category.create({
    data: { workspaceId: workspace.id, name: 'Returns & Refunds', slug: 'returns', description: 'Return windows, replacement rules, and refund status' }
  });
  const catProducts = await prisma.category.create({
    data: { workspaceId: workspace.id, name: 'Products & Billing', slug: 'products', description: 'Hardware specs, pricing, warranty, and invoices' }
  });

  const tagUrgent = await prisma.tag.create({ data: { workspaceId: workspace.id, name: 'Urgent' } });
  const tagVIP = await prisma.tag.create({ data: { workspaceId: workspace.id, name: 'VIP Customer' } });
  const tagBilling = await prisma.tag.create({ data: { workspaceId: workspace.id, name: 'Billing' } });

  // FAQs
  const faqs = [
    {
      question: 'Where are you located?',
      answer: 'Our main headquarters is located at 100 Innovation Way, Suite 400, San Francisco, CA 94105. We also operate fulfillment centers in Chicago, Austin, and Frankfurt.',
      summary: 'San Francisco HQ & global distribution centers.',
      categoryId: catGeneral.id
    },
    {
      question: 'What are your support hours?',
      answer: 'Our customer support team is available Monday through Friday from 8:00 AM to 6:00 PM PST. Automated support via chatbots.ai is active 24/7.',
      summary: 'Mon-Fri 8am-6pm PST live support; 24/7 self-service.',
      categoryId: catGeneral.id
    },
    {
      question: 'How do I track my order status?',
      answer: 'You can check your order status directly in this chat! Simply reply with your order number (e.g. ORD-10025) or click "Track my order" in the menu.',
      summary: 'Enter order number like ORD-10025 for instant tracking.',
      categoryId: catShipping.id
    },
    {
      question: 'What is your shipping time?',
      answer: 'Standard domestic shipping takes 3-5 business days. Express overnight shipping is available at checkout for orders placed before 2 PM PST.',
      summary: '3-5 business days standard, 1-day express available.',
      categoryId: catShipping.id
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day hassle-free return window for all unused products in original packaging. Items can be returned for full store credit or refund.',
      summary: '30-day money back guarantee on unopened items.',
      categoryId: catReturns.id
    },
    {
      question: 'How long do refunds take to process?',
      answer: 'Once our warehouse receives and inspects your returned item, refunds are issued within 3-5 business days to your original payment method.',
      summary: '3-5 business days post-warehouse inspection.',
      categoryId: catReturns.id
    },
    {
      question: 'Do you offer warranty on products?',
      answer: 'Yes! All Acme products come with a standard 1-year limited manufacturer warranty covering defects in materials and craftsmanship.',
      summary: '1-year standard hardware warranty included.',
      categoryId: catProducts.id
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Visa, MasterCard, American Express, PayPal, Apple Pay, Google Pay, and Wire Transfers for commercial enterprise orders.',
      summary: 'Credit cards, PayPal, Apple/Google Pay, Wire Transfers.',
      categoryId: catProducts.id
    },
    {
      question: 'How do I cancel my subscription or order?',
      answer: 'Orders can be cancelled within 1 hour of placing them if they have not entered processing. Contact our live agents immediately to request cancellation.',
      summary: 'Cancellations allowed within 1 hour before shipment.',
      categoryId: catReturns.id
    },
    {
      question: 'How can I reach a human representative?',
      answer: 'You can request a human representative anytime by typing "agent", "human", or selecting "Talk to an Agent" from the menu choices.',
      summary: 'Type agent or human to handoff to live staff.',
      categoryId: catGeneral.id
    }
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: {
        workspaceId: workspace.id,
        question: faq.question,
        answer: faq.answer,
        summary: faq.summary,
        categoryId: faq.categoryId,
        isPublished: true,
        priority: 10
      }
    });
  }

  // Knowledge Base Articles
  await prisma.knowledgeArticle.createMany({
    data: [
      {
        workspaceId: workspace.id,
        categoryId: catShipping.id,
        title: 'Global Shipping Rates & Carrier Policy',
        slug: 'global-shipping-rates',
        summary: 'Detailed explanation of international carrier duties, customs clearance, and delivery fees.',
        content: `### Overview\nAcme ships globally via DHL Express and FedEx. Delivery costs are calculated at checkout based on weight and country of destination.\n\n### Customs & Import Taxes\nInternational packages may be subject to local duty and import taxes. Customer is responsible for VAT/Customs clearance fees.`,
        status: ArticleStatus.PUBLISHED,
        visibility: ArticleVisibility.PUBLIC
      },
      {
        workspaceId: workspace.id,
        categoryId: catReturns.id,
        title: 'Step-by-Step Return Portal Guide',
        slug: 'return-portal-guide',
        summary: 'How to generate a prepaid return shipping label and track your RMA shipment.',
        content: `### Initiating a Return\n1. Visit acme.example.com/returns\n2. Enter your order ID and postal code.\n3. Print the generated prepaid shipping label.\n4. Drop off package at any authorized UPS location.`,
        status: ArticleStatus.PUBLISHED,
        visibility: ArticleVisibility.PUBLIC
      }
    ]
  });

  // Business Data Store - Products
  const prodWidgetX = await prisma.product.create({
    data: {
      workspaceId: workspace.id,
      sku: 'ACME-WGT-001',
      name: 'Acme SmartHub Pro',
      description: 'Enterprise smart automation hub with IoT integration and low-latency response.',
      price: 299.99,
      inStock: true,
      stockQuantity: 142,
      category: 'Smart Hardware',
      supportInfo: 'Includes 24/7 phone support and 2-year extended warranty.'
    }
  });

  const prodSensor = await prisma.product.create({
    data: {
      workspaceId: workspace.id,
      sku: 'ACME-SNS-002',
      name: 'Acme Wireless Environmental Sensor',
      description: 'Precision temperature, humidity, and atmospheric quality monitoring sensor.',
      price: 49.50,
      inStock: true,
      stockQuantity: 530,
      category: 'Sensors',
      supportInfo: 'Battery replaceable CR2032 with 2 year lifespan.'
    }
  });

  // Business Data Store - Services
  await prisma.service.create({
    data: {
      workspaceId: workspace.id,
      name: 'On-Site Enterprise Hardware Installation',
      description: 'Dedicated technician on-site deployment, cabling, and infrastructure integration.',
      price: 850.00,
      duration: '4-6 Hours',
      availability: 'Mon-Fri 09:00 - 17:00 EST',
      requirements: 'Network access and server rack clearance required.'
    }
  });

  // Business Data Store - Customers
  const customerJohn = await prisma.customer.create({
    data: {
      workspaceId: workspace.id,
      name: 'John Doe',
      email: 'john.doe@techcorp.io',
      phone: '+1 (415) 888-0122',
      company: 'TechCorp Solutions',
      notes: 'Key enterprise account. Interested in bulk sensor deployment.',
      tags: { connect: [{ id: tagVIP.id }] }
    }
  });

  const customerJane = await prisma.customer.create({
    data: {
      workspaceId: workspace.id,
      name: 'Jane Smith',
      email: 'jane.smith@designco.org',
      phone: '+1 (512) 777-3401',
      company: 'Design Co',
      notes: 'Inquired about order tracking ORD-10025.'
    }
  });

  // Business Data Store - Orders
  await prisma.order.createMany({
    data: [
      {
        workspaceId: workspace.id,
        customerId: customerJohn.id,
        orderNumber: 'ORD-10025',
        status: 'In Transit',
        totalAmount: 349.49,
        items: [
          { sku: prodWidgetX.sku, name: prodWidgetX.name, qty: 1, unitPrice: prodWidgetX.price },
          { sku: prodSensor.sku, name: prodSensor.name, qty: 1, unitPrice: prodSensor.price }
        ],
        trackingNumber: '1Z9999999999999999',
        carrier: 'UPS Ground',
        deliveryStatus: 'Out for delivery',
        estimatedDelivery: new Date(Date.now() + 86400000)
      },
      {
        workspaceId: workspace.id,
        customerId: customerJane.id,
        orderNumber: 'ORD-10082',
        status: 'Delivered',
        totalAmount: 148.50,
        items: [
          { sku: prodSensor.sku, name: prodSensor.name, qty: 3, unitPrice: prodSensor.price }
        ],
        trackingNumber: '9400100000000000000000',
        carrier: 'USPS Priority',
        deliveryStatus: 'Delivered to front porch',
        estimatedDelivery: new Date(Date.now() - 86400000 * 2)
      }
    ]
  });

  // Custom Collections (e.g., Branches, Courses)
  const branchCollection = await prisma.customCollection.create({
    data: {
      workspaceId: workspace.id,
      name: 'Branches',
      slug: 'branches',
      description: 'Physical company branch offices and pickup points',
      fields: {
        create: [
          { name: 'City', key: 'city', fieldType: 'TEXT', isRequired: true },
          { name: 'Address', key: 'address', fieldType: 'TEXT', isRequired: true },
          { name: 'Phone Number', key: 'phone', fieldType: 'TEXT', isRequired: false },
          { name: 'Opening Hours', key: 'hours', fieldType: 'TEXT', isRequired: false }
        ]
      }
    }
  });

  await prisma.customRecord.createMany({
    data: [
      {
        collectionId: branchCollection.id,
        data: {
          city: 'San Francisco',
          address: '100 Innovation Way, Suite 400',
          phone: '+1 (415) 555-0100',
          hours: 'Mon-Fri 8am-6pm PST'
        }
      },
      {
        collectionId: branchCollection.id,
        data: {
          city: 'Chicago',
          address: '500 N Michigan Ave, Suite 1200',
          phone: '+1 (312) 555-0200',
          hours: 'Mon-Fri 9am-5pm CST'
        }
      }
    ]
  });

  // Create Primary Chatbot
  const mainBot = await prisma.bot.create({
    data: {
      workspaceId: workspace.id,
      name: 'Acme Support Assistant',
      identifier: 'acme-main-bot',
      description: 'Primary customer service automated assistant for order tracking, FAQs, and support.',
      status: BotStatus.PUBLISHED,
      welcomeMessage: 'Hi there! Welcome to Acme Support. How can I assist you today?',
      fallbackResponse: 'I want to ensure you get accurate assistance. I couldn\'t find an exact match for that question. Please pick an option below or request a human agent.',
      offlineResponse: 'Our agents are currently offline. Please leave your email and question, and we will follow up during business hours.',
      language: 'en',
      tone: 'friendly',
      humanHandoffEnabled: true,
      handoffKeywords: ['agent', 'human', 'representative', 'support staff', 'speak to someone'],
      theme: {
        create: {
          primaryColor: '#2563eb',
          secondaryColor: '#1d4ed8',
          backgroundColor: '#ffffff',
          textColor: '#0f172a',
          fontFamily: 'Inter, sans-serif',
          launcherIcon: 'message-square',
          position: 'bottom-right',
          headerTitle: 'Acme Support Desk'
        }
      },
      widgetConfig: {
        create: {
          allowedDomains: ['*'],
          quickReplies: [
            { label: 'Track My Order', payload: 'track_order', action: 'trigger_workflow' },
            { label: 'Return Policy', payload: 'return_policy', action: 'send_rule' },
            { label: 'Office Locations', payload: 'location', action: 'send_rule' },
            { label: 'Speak to Human Agent', payload: 'speak_human', action: 'handoff' }
          ],
          showAgentAvatar: true,
          soundNotifications: true
        }
      }
    }
  });

  // Create Secondary Chatbot
  await prisma.bot.create({
    data: {
      workspaceId: workspace.id,
      name: 'Sales & Product Inquiry Bot',
      identifier: 'acme-sales-bot',
      description: 'Specialized bot for product specs, pricing, and enterprise sales inquiries.',
      status: BotStatus.DRAFT,
      welcomeMessage: 'Looking for Acme hardware products or bulk quotes? Let me help!',
      theme: {
        create: {
          primaryColor: '#059669',
          secondaryColor: '#047857',
          headerTitle: 'Acme Sales Desk'
        }
      }
    }
  });

  // Configure Bot Rules for Main Bot
  await prisma.botRule.create({
    data: {
      botId: mainBot.id,
      name: 'Greeting Rule',
      category: 'greeting',
      matchType: MatchType.EXACT_KEYWORD,
      triggers: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      priority: 100,
      isActive: true,
      response: 'Hello! I am Acme\'s automated assistant. How can I help you today? You can ask about order status, return policies, warranty, or branch locations.',
      quickReplies: [
        { label: 'Track Order', payload: 'Where is my order?' },
        { label: 'Return Policy', payload: 'What is your return policy?' },
        { label: 'Talk to Agent', payload: 'I need a human agent' }
      ]
    }
  });

  await prisma.botRule.create({
    data: {
      botId: mainBot.id,
      name: 'Location & Address Rule',
      category: 'location',
      matchType: MatchType.PARTIAL_KEYWORD,
      triggers: ['location', 'address', 'where are you', 'headquarters', 'office', 'branches'],
      priority: 90,
      isActive: true,
      response: 'Our corporate headquarters is located at 100 Innovation Way, Suite 400, San Francisco, CA 94105. We also have distribution hubs and branch offices in Chicago and Austin.',
      actions: {
        create: [
          { actionType: 'FETCH_COLLECTION', targetKey: 'branches' }
        ]
      }
    }
  });

  await prisma.botRule.create({
    data: {
      botId: mainBot.id,
      name: 'Refund & Return Policy Rule',
      category: 'returns',
      matchType: MatchType.PARTIAL_KEYWORD,
      triggers: ['refund', 'return', 'returns', 'exchange', 'money back'],
      priority: 85,
      isActive: true,
      response: 'We offer a 30-day money-back guarantee for unused products in original packaging! Returns are processed within 3-5 business days after inspection at our warehouse.'
    }
  });

  await prisma.botRule.create({
    data: {
      botId: mainBot.id,
      name: 'Order Status Query Trigger',
      category: 'order_status',
      matchType: MatchType.PARTIAL_KEYWORD,
      triggers: ['order status', 'where is my order', 'track order', 'track my package', 'shipping status'],
      priority: 95,
      isActive: true,
      response: 'I can quickly check your order status! Please reply with your Order Number (for example: **ORD-10025**).',
      actions: {
        create: [
          { actionType: 'PROMPT_VARIABLE', targetKey: 'orderNumber' }
        ]
      }
    }
  });

  // Workflows for Main Bot
  const orderWorkflow = await prisma.workflow.create({
    data: {
      botId: mainBot.id,
      name: 'Order Lookup Flow',
      trigger: 'order_lookup',
      description: 'Interactive workflow that requests order ID and queries PostgreSQL orders database.',
      isActive: true,
      isPublished: true
    }
  });

  const nodeStart = await prisma.workflowNode.create({
    data: {
      workflowId: orderWorkflow.id,
      nodeType: WorkflowNodeType.MESSAGE,
      label: 'Welcome to Order Tracking',
      content: 'I will help you retrieve real-time status on your shipment.',
      positionX: 100,
      positionY: 100
    }
  });

  const nodeAskOrder = await prisma.workflowNode.create({
    data: {
      workflowId: orderWorkflow.id,
      nodeType: WorkflowNodeType.COLLECT_ORDER_ID,
      label: 'Ask for Order ID',
      content: 'Please enter your order number (e.g., ORD-10025):',
      variableName: 'orderNumber',
      positionX: 100,
      positionY: 220
    }
  });

  const nodeQueryDB = await prisma.workflowNode.create({
    data: {
      workflowId: orderWorkflow.id,
      nodeType: WorkflowNodeType.SEARCH_DATABASE,
      label: 'Query Orders Database',
      content: 'Searching database for order record...',
      config: { targetTable: 'Order', filterKey: 'orderNumber' },
      positionX: 100,
      positionY: 340
    }
  });

  const nodeEnd = await prisma.workflowNode.create({
    data: {
      workflowId: orderWorkflow.id,
      nodeType: WorkflowNodeType.END,
      label: 'Finish Workflow',
      content: 'Is there anything else I can help you with today?',
      options: ['Check another order', 'Return to main menu', 'Talk to representative'],
      positionX: 100,
      positionY: 460
    }
  });

  await prisma.workflowEdge.createMany({
    data: [
      { workflowId: orderWorkflow.id, sourceNodeId: nodeStart.id, targetNodeId: nodeAskOrder.id },
      { workflowId: orderWorkflow.id, sourceNodeId: nodeAskOrder.id, targetNodeId: nodeQueryDB.id },
      { workflowId: orderWorkflow.id, sourceNodeId: nodeQueryDB.id, targetNodeId: nodeEnd.id }
    ]
  });

  // Seed Conversations and Messages for realistic dashboard demo
  const sampleConv1 = await prisma.conversation.create({
    data: {
      workspaceId: workspace.id,
      botId: mainBot.id,
      customerId: customerJohn.id,
      sessionId: 'sess-demo-001',
      status: ConversationStatus.RESOLVED,
      channel: 'widget',
      subject: 'Order Tracking Query ORD-10025',
      startedAt: new Date(Date.now() - 3600000 * 4),
      endedAt: new Date(Date.now() - 3600000 * 3),
      lastMessageAt: new Date(Date.now() - 3600000 * 3),
      messages: {
        create: [
          { senderType: 'CUSTOMER', content: 'Where is my order?' },
          { senderType: 'BOT', content: 'I can help you check your order. Please enter your order number.' },
          { senderType: 'CUSTOMER', content: 'ORD-10025' },
          { senderType: 'BOT', content: '📦 **Order ORD-10025 Status:** In Transit\n**Carrier:** UPS Ground (1Z9999999999999999)\n**Delivery Status:** Out for delivery\n**Total:** $349.49' },
          { senderType: 'CUSTOMER', content: 'Awesome, thanks!' },
          { senderType: 'BOT', content: 'You are very welcome! Have a great day.' }
        ]
      }
    }
  });

  const sampleConv2 = await prisma.conversation.create({
    data: {
      workspaceId: workspace.id,
      botId: mainBot.id,
      customerId: customerJane.id,
      sessionId: 'sess-demo-002',
      status: ConversationStatus.ESCALATED,
      channel: 'widget',
      subject: 'Human Handoff Request - Bulk Quote',
      assignedAgentId: agentUser.id,
      startedAt: new Date(Date.now() - 3600000 * 2),
      lastMessageAt: new Date(Date.now() - 60000 * 15),
      messages: {
        create: [
          { senderType: 'CUSTOMER', content: 'I need to speak with a human agent about a custom enterprise order.' },
          { senderType: 'BOT', content: 'Connecting you with a support representative right away. An agent will be with you shortly.' },
          { senderType: 'SYSTEM', content: 'Conversation escalated to human agent Alex Rivera.' },
          { senderType: 'AGENT', senderUserId: agentUser.id, content: 'Hi Jane! I am Alex from the enterprise team. How many units were you looking to deploy?' }
        ]
      }
    }
  });

  // Seed Analytics Events
  await prisma.analyticsEvent.createMany({
    data: [
      { workspaceId: workspace.id, botId: mainBot.id, conversationId: sampleConv1.id, eventType: 'RULE_MATCHED', metricName: 'rule_order_status' },
      { workspaceId: workspace.id, botId: mainBot.id, conversationId: sampleConv1.id, eventType: 'MESSAGE_SENT', metricName: 'bot_response' },
      { workspaceId: workspace.id, botId: mainBot.id, conversationId: sampleConv2.id, eventType: 'HANDOFF_TRIGGERED', metricName: 'human_escalation' }
    ]
  });

  // Seed Audit Log
  await prisma.auditLog.createMany({
    data: [
      { workspaceId: workspace.id, userId: ownerUser.id, action: 'CREATE_BOT', resource: 'Bot', resourceId: mainBot.id, details: { name: mainBot.name } },
      { workspaceId: workspace.id, userId: ownerUser.id, action: 'PUBLISH_BOT', resource: 'Bot', resourceId: mainBot.id },
      { workspaceId: workspace.id, userId: ownerUser.id, action: 'SEED_INITIAL_DATA', resource: 'Workspace', resourceId: workspace.id }
    ]
  });

  console.log('Database successfully seeded with realistic Acme Support data!');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
